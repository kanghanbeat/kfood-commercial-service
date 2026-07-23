import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@kfood/types", "@kfood/config", "@kfood/data"],
  experimental: {
    serverActions: {
      // 어드민 사진 업로드용. 기본 1MB로는 사진이 안 올라간다(사진 자체는 5MB 제한).
      bodySizeLimit: "8mb"
    }
  },
  turbopack: {
    root: resolve(__dirname, "..")
  }
};

export default nextConfig;
