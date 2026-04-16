import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const INDEXNOW_ENDPOINT =
  process.env.INDEXNOW_ENDPOINT ?? 'https://api.indexnow.org/indexnow';
const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY ?? '67113058df4248ce8ad3b2142ccf30ab';

interface CliOptions {
  baseUrl?: string;
  dryRun: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    dryRun: false,
  };

  for (const arg of argv) {
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg.startsWith('--base-url=')) {
      options.baseUrl = arg.slice('--base-url='.length);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

function getBaseUrl(): string {
  return normalizeBaseUrl(
    process.env.NEXT_PUBLIC_BASE_URL ??
      `http://localhost:${process.env.PORT ?? 3000}`
  );
}

async function assertLocalKeyFile(): Promise<void> {
  const keyFilePath = path.resolve('public', `${INDEXNOW_KEY}.txt`);
  const fileContents = (await readFile(keyFilePath, 'utf8')).trim();

  if (fileContents !== INDEXNOW_KEY) {
    throw new Error(
      `Key file mismatch at ${keyFilePath}. Expected "${INDEXNOW_KEY}" but received "${fileContents}".`
    );
  }
}

async function assertRemoteKeyFile(keyLocation: string): Promise<void> {
  const response = await fetch(keyLocation, {
    headers: {
      'user-agent': 'voice-clone-indexnow-script/1.0',
    },
    signal: AbortSignal.timeout(10_000),
  });
  const responseText = (await response.text()).trim();

  if (!response.ok) {
    throw new Error(
      `Remote key file check failed with status ${response.status} for ${keyLocation}.`
    );
  }

  if (responseText !== INDEXNOW_KEY) {
    throw new Error(
      `Remote key file content mismatch at ${keyLocation}. Expected "${INDEXNOW_KEY}" but received "${responseText}".`
    );
  }
}

async function getSitemapUrls(baseUrl: string): Promise<string[]> {
  const sitemapUrl = `${baseUrl}/sitemap.xml`;
  const response = await fetch(sitemapUrl, {
    headers: {
      'user-agent': 'voice-clone-indexnow-script/1.0',
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(
      `Sitemap request failed with status ${response.status} for ${sitemapUrl}.`
    );
  }

  const xml = await response.text();
  const matches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
  const urlList = [...new Set([...matches].map((match) => match[1]?.trim()))]
    .filter((url): url is string => Boolean(url))
    .filter((url) => url.startsWith(baseUrl));

  if (urlList.length === 0) {
    throw new Error(`No URLs found in ${sitemapUrl}.`);
  }

  return urlList;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const baseUrl = normalizeBaseUrl(options.baseUrl ?? getBaseUrl());
  const host = new URL(baseUrl).host;
  const keyLocation = `${baseUrl}/${INDEXNOW_KEY}.txt`;

  await assertLocalKeyFile();

  const urlList = await getSitemapUrls(baseUrl);
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList,
  };

  if (options.dryRun) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          endpoint: INDEXNOW_ENDPOINT,
          sitemapUrl: `${baseUrl}/sitemap.xml`,
          ...payload,
          urlCount: urlList.length,
        },
        null,
        2
      )
    );
    return;
  }

  await assertRemoteKeyFile(keyLocation);

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'user-agent': 'voice-clone-indexnow-script/1.0',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20_000),
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `IndexNow request failed with status ${response.status}: ${responseText}`
    );
  }

  console.log(
    JSON.stringify(
      {
        endpoint: INDEXNOW_ENDPOINT,
        sitemapUrl: `${baseUrl}/sitemap.xml`,
        host,
        keyLocation,
        urlCount: urlList.length,
        urlList,
        status: response.status,
        body: responseText,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
