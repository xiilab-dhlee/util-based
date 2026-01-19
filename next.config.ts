import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker standalone 빌드 모드 활성화 (이미지 크기 최소화)
  output: "standalone",
  // React 컴파일러 활성화
  reactCompiler: true,
  // styled-components 활성화
  compiler: {
    styledComponents: true,
  },
  // 환경변수를 클라이언트에 노출 (짧은 이름으로 매핑)
  env: {
    MSW_ENABLE: process.env.MSW_ENABLE,
    TEST_AUTH_ENABLE: process.env.TEST_AUTH_ENABLE,
    MOCK_DELAY: process.env.MOCK_DELAY,
  },
  // API 프록시 설정
  rewrites: async () => {
    const rewriteRules = [
      {
        source: "/core-api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
      {
        source: "/monitor-api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`,
      },
    ];

    return rewriteRules;
  },
};

export default nextConfig;
