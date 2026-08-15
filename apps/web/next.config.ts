import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@nox/core", "@nox/layouts", "@nox/render"],
}

export default nextConfig
