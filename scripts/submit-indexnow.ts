import { execSync } from 'node:child_process';
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

function ensureContentCollectionsGenerated(): void {
  execSync('pnpm docs', {
    stdio: 'inherit',
  });
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

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  ensureContentCollectionsGenerated();

  const [{ getIndexableUrls }, { getBaseUrl }] = await Promise.all([
    import('../src/lib/seo/indexable-urls'),
    import('../src/lib/urls/urls'),
  ]);

  const baseUrl = normalizeBaseUrl(
    options.baseUrl ?? process.env.NEXT_PUBLIC_BASE_URL ?? getBaseUrl()
  );
  const host = new URL(baseUrl).host;
  const keyLocation = `${baseUrl}/${INDEXNOW_KEY}.txt`;
  const urlList = getIndexableUrls().filter((url) => url.startsWith(baseUrl));

  if (urlList.length === 0) {
    throw new Error(`No indexable URLs generated for ${baseUrl}.`);
  }

  await assertLocalKeyFile();

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
          ...payload,
          urlCount: urlList.length,
          remoteKeyCheckSkipped: true,
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
