"use client";

import { usePathname, useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";

import { useGetLatestLicense } from "@/api/generated/license/license";
import { MySpinner } from "@/shared/components/spinner";

// 테스트 환경 여부 (pnpm dev:test)
const useTestAuth = process.env.TEST_AUTH_ENABLE === "true";

// 라이선스 체크 제외 경로
const EXCLUDED_PATHS = ["/license", "/error"];

// 라이선스 유효성 검사
function isLicenseValid(expiredAt: string | undefined): boolean {
  if (!expiredAt) return false;
  return new Date(expiredAt) > new Date();
}

/**
 * 라이선스 체크 Provider
 *
 * 인증 여부와 관계없이 라이선스 유효성을 먼저 검사합니다.
 * 유효한 라이선스가 있어야만 인증 과정으로 진행됩니다.
 *
 * 동작 흐름:
 * 1. 프로젝트 접근
 * 2. 라이선스 체크 (인증 과정 X)
 * 3. 유효한 라이선스 확인 시 → 인증 과정 진행 → 로그인 화면
 * 4. 미등록 또는 만료 시 → /license 페이지로 리다이렉트
 * 5. API 에러 시 → /error 페이지로 리다이렉트
 *
 * - 제외 경로 (/license, /error): 라이선스 체크 스킵
 * - 테스트 환경 (TEST_AUTH_ENABLE=true): 라이선스 체크 스킵
 */
export function LicenseProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();

  // 제외 경로 체크
  const isExcludedPath = EXCLUDED_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  // 테스트 환경이거나 제외 경로면 라이선스 체크 스킵
  const shouldSkipLicenseCheck = useTestAuth || isExcludedPath;

  const { data, isLoading, isError } = useGetLatestLicense({
    query: {
      enabled: !shouldSkipLicenseCheck,
      staleTime: 5 * 60 * 1000, // 5분 캐싱
      refetchOnWindowFocus: false,
    },
  });

  const isValid = isLicenseValid(data?.expiredAt);

  // 라이선스 체크 결과에 따른 리다이렉트
  useEffect(() => {
    if (shouldSkipLicenseCheck) return;
    if (isLoading) return;

    // API 에러 시 에러 페이지로 이동
    if (isError) {
      router.replace("/error?error=LicenseCheckFailed");
      return;
    }

    // 미등록 또는 만료 시 라이선스 페이지로 이동
    if (!data || !isValid) {
      router.replace("/license");
    }
  }, [shouldSkipLicenseCheck, isLoading, isError, data, isValid, router]);

  // 테스트 환경이거나 제외 경로면 바로 렌더링
  if (shouldSkipLicenseCheck) {
    return <>{children}</>;
  }

  // 라이선스 체크 중 로딩 표시
  if (isLoading) {
    return <MySpinner />;
  }

  // API 에러 시 리다이렉트 대기 중 (useEffect에서 처리)
  if (isError) {
    return <MySpinner />;
  }

  // 유효한 라이선스가 있으면 정상 렌더링 (인증 과정 진행)
  if (data && isValid) {
    return <>{children}</>;
  }

  // 리다이렉트 대기 중 (useEffect에서 처리)
  return <MySpinner />;
}
