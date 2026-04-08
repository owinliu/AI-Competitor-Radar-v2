/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] || "AI-Competitor-Radar";
const basePath = isGithubActions ? `/${repo}` : "";

const nextConfig = {
  output: isGithubActions ? "export" : "standalone",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
