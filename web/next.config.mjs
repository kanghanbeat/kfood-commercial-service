import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@kfood/types", "@kfood/config", "@kfood/data"],
  experimental: {
    serverActions: {
      // 어드민 사진 업로드용. 여러 장 한 번에 올리므로 넉넉히 잡는다(사진 한 장은 5MB 제한).
      bodySizeLimit: "40mb"
    }
  },
  turbopack: {
    root: resolve(__dirname, "..")
  }
};

export default nextConfig;
