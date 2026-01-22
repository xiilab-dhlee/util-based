"use client";

import {
  type GetPrivateImageUsageByAccountQueryError,
  useGetPrivateImageUsageByAccount,
} from "@/api/generated/admin-private-registry/admin-private-registry";
import {
  type GetPublicImageUsageByAccountQueryError,
  useGetPublicImageUsageByAccount,
} from "@/api/generated/admin-public-registry/admin-public-registry";
import type {
  GetPrivateImageUsageByAccountParams,
  GetPublicImageUsageByAccountParams,
  PageResponsePrivateImageUsageResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/** 사용자별 레지스트리 사용 현황 조회 파라미터 (API 구조 그대로 사용) */
export type GetRegistryUserListParams =
  | GetPrivateImageUsageByAccountParams
  | GetPublicImageUsageByAccountParams;

/** 사용자별 레지스트리 사용 현황 조회 에러 타입 */
export type GetRegistryUserListQueryError =
  | GetPrivateImageUsageByAccountQueryError
  | GetPublicImageUsageByAccountQueryError;

interface UseGetRegistryUserListByModeOptions {
  query?: {
    enabled?: boolean;
  };
}

interface UseGetRegistryUserListByModeResult {
  data: PageResponsePrivateImageUsageResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: GetRegistryUserListQueryError | null;
  refetch: () => void;
}

/**
 * 사용자별 레지스트리 사용 현황 조회 (모드에 따라 다른 API 사용)
 *
 * @param mode - 레지스트리 모드 (private | public)
 * @param params - API 파라미터 (중첩 구조 그대로 전달)
 * @param options - React Query 옵션
 * @returns 사용자별 사용 현황 조회 결과 (unwrapped data)
 */
export const useGetRegistryUserListByMode = (
  mode: RegistryMode,
  params: GetRegistryUserListParams,
  options?: UseGetRegistryUserListByModeOptions,
): UseGetRegistryUserListByModeResult => {
  const privateQuery = useGetPrivateImageUsageByAccount(
    params as GetPrivateImageUsageByAccountParams,
    {
      query: {
        enabled: mode === "private" && (options?.query?.enabled ?? true),
      },
    },
  );

  const publicQuery = useGetPublicImageUsageByAccount(
    params as GetPublicImageUsageByAccountParams,
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
