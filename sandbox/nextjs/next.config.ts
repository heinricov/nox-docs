import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@nox/core", "@nox/layouts", "@nox/render"],
}

export default nextConfig
