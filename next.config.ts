import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 사용자가 추가했던 외부 접속 허용 설정 (표준 문법으로 통합)
  experimental: {
    serverActions: {
      allowedOrigins: ['172.30.1.99']
    }
  }
};

export default nextConfig;