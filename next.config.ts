import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

const nextConfig: NextConfig = {
  /* config options here */
};

// https://www.content-collections.dev/docs/quickstart/next
// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
