import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React 컴파일러 활성화
  reactCompiler: true,
  compiler: {
    styledComponents: true,
  },
  // API 프록시 설정 - CORS 문제 해결 및 API 경로 단순화
  rewrites: async () => {
    const rewriteRules = [
      {
        source: "/core-api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
      {
        source: "/batch-api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BATCH_API_URL}/api/:path*`,
      },
      {
        source: "/monitor-api/:path*",
        destination: `${process.env.NEXT_PUBLIC_MONITOR_API_URL}/api/:path*`,
      },
      {
        source: "/predict-api/:path*",
        destination: `${process.env.NEXT_PUBLIC_PREDICTION_API_URL}/:path*`,
      },
    ];

    console.table(rewriteRules);

    return rewriteRules;
  },
};

export default nextConfig;
