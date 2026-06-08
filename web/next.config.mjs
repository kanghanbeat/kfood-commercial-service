import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@kfood/types", "@kfood/config", "@kfood/data"],
  turbopack: {
    root: resolve(__dirname, "..")
  }
};

export default nextConfig;
