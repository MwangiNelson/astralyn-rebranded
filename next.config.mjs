/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  /* Phosphor's barrel re-exports 9,000 icons; without this every import of
     one of them pulls the whole family into the dev compile. */
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  async redirects() {
    return [
      // /founders became /team when the page grew past the four founders.
      { source: "/founders", destination: "/team", permanent: true },
    ];
  },
};

export default nextConfig;
