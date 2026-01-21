"use client";

import type {
  GetPrivateRegistryListParams,
  GetPublicRegistryListParams,
  PageResponseRegistryListResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  type GetPrivateRegistryListQueryError,
  useGetPrivateRegistryList,
} from "@/api/generated/private-registry/private-registry";
import {
  type GetPublicRegistryListQueryError,
  useGetPublicRegistryList,
} from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/** 레지스트리 목록 조회 파라미터 (private/public 공통) */
type GetRegistryListParams =
  | GetPrivateRegistryListParams
  | GetPublicRegistryListParams;

/** 레지스트리 목록 조회 에러 타입 */
type GetRegistryListQueryError =
  | GetPrivateRegistryListQueryError
  | GetPublicRegistryListQueryError;

interface UseGetRegistryListByModeOptions {
  query?: {
    enabled?: boolean;
  };
}

interface UseGetRegistryListByModeResult {
  data: PageResponseRegistryListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: GetRegistryListQueryError | null;
  refetch: () => void;
}

/**
 * 레지스트리 목록 조회 (모드에 따라 다른 API 사용)
 *
 * @param mode - 레지스트리 모드 (private | public)
 * @param params - 목록 조회 파라미터
 * @param options - React Query 옵션
 * @returns 레지스트리 목록 조회 결과 (unwrapped data)
 */
export const useGetRegistryListByMode = (
  mode: RegistryMode,
  params?: GetRegistryListParams,
  options?: UseGetRegistryListByModeOptions,
): UseGetRegistryListByModeResult => {
  const privateQuery = useGetPrivateRegistryList(
    params as GetPrivateRegistryListParams,
    {
      query: {
        enabled: mode === "private" && (options?.query?.enabled ?? true),
      },
    },
  );

  const publicQuery = useGetPublicRegistryList(
    params as GetPublicRegistryListParams,
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
