"use client";

import type {
  GetPrivateImageTagVulnerabilitiesParams,
  GetPublicImageTagVulnerabilitiesParams,
  PageResponseVulnerabilityDetailResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  type GetPrivateImageTagVulnerabilitiesQueryError,
  useGetPrivateImageTagVulnerabilities,
} from "@/api/generated/private-registry/private-registry";
import {
  type GetPublicImageTagVulnerabilitiesQueryError,
  useGetPublicImageTagVulnerabilities,
} from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/** 레지스트리 태그 취약점 목록 조회 파라미터 (private/public 공통) */
export type GetRegistryTagVulnerabilitiesParams =
  | GetPrivateImageTagVulnerabilitiesParams
  | GetPublicImageTagVulnerabilitiesParams;

/** 레지스트리 태그 취약점 목록 조회 에러 타입 */
export type GetRegistryTagVulnerabilitiesQueryError =
  | GetPrivateImageTagVulnerabilitiesQueryError
  | GetPublicImageTagVulnerabilitiesQueryError;

interface UseGetRegistryTagVulnerabilitiesByModeOptions {
  query?: {
    enabled?: boolean;
  };
}

interface UseGetRegistryTagVulnerabilitiesByModeResult {
  data: PageResponseVulnerabilityDetailResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: GetRegistryTagVulnerabilitiesQueryError | null;
  refetch: () => void;
}

/**
 * 레지스트리 이미지 태그 취약점 목록 조회 (모드에 따라 다른 API 사용)
 *
 * @param mode - 레지스트리 모드 (private | public)
 * @param params - 목록 조회 파라미터
 * @param options - React Query 옵션
 * @returns 레지스트리 태그 취약점 목록 조회 결과 (unwrapped data)
 */
export const useGetRegistryTagVulnerabilitiesByMode = (
  mode: RegistryMode,
  params: GetRegistryTagVulnerabilitiesParams,
  options?: UseGetRegistryTagVulnerabilitiesByModeOptions,
): UseGetRegistryTagVulnerabilitiesByModeResult => {
  const privateQuery = useGetPrivateImageTagVulnerabilities(
    params as GetPrivateImageTagVulnerabilitiesParams,
    {
      query: {
        enabled: mode === "private" && (options?.query?.enabled ?? true),
      },
    },
  );

  const publicQuery = useGetPublicImageTagVulnerabilities(
    params as GetPublicImageTagVulnerabilitiesParams,
    {
      query: {
        enabled: mode === "public" && (options?.query?.enabled ?? true),
      },
    },
  );

  const query = mode === "private" ? privateQuery : publicQuery;

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
