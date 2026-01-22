"use client";

import {
  type GetPrivateImageTagsByAccountIdQueryError,
  useGetPrivateImageTagsByAccountId,
} from "@/api/generated/admin-private-registry/admin-private-registry";
import {
  type GetPublicImageTagsByAccountIdQueryError,
  useGetPublicImageTagsByAccountId,
} from "@/api/generated/admin-public-registry/admin-public-registry";
import type {
  GetPrivateImageTagsByAccountIdParams,
  GetPublicImageTagsByAccountIdParams,
  PageResponseAccountImageTagResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/** 사용자별 이미지 태그 조회 파라미터 (API 구조 그대로 사용) */
export type GetRegistryUserTagsParams =
  | GetPrivateImageTagsByAccountIdParams
  | GetPublicImageTagsByAccountIdParams;

/** 사용자별 이미지 태그 조회 에러 타입 */
export type GetRegistryUserTagsQueryError =
  | GetPrivateImageTagsByAccountIdQueryError
  | GetPublicImageTagsByAccountIdQueryError;

interface UseGetRegistryUserTagsByAccountIdByModeOptions {
  query?: {
    enabled?: boolean;
  };
}

interface UseGetRegistryUserTagsByAccountIdByModeResult {
  data: PageResponseAccountImageTagResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: GetRegistryUserTagsQueryError | null;
  refetch: () => void;
}

/**
 * 모드에 따라 private/public 사용자별 이미지 태그 목록을 조회하는 훅
 *
 * @param mode - 레지스트리 모드 (private | public)
 * @param accountId - 사용자 계정 ID
 * @param params - API 파라미터 (중첩 구조 그대로 전달)
 * @param options - React Query 옵션
 * @returns 사용자별 이미지 태그 목록 조회 결과 (unwrapped data)
 */
export const useGetRegistryUserTagsByAccountIdByMode = (
  mode: RegistryMode,
  accountId: string,
  params: GetRegistryUserTagsParams,
  options?: UseGetRegistryUserTagsByAccountIdByModeOptions,
): UseGetRegistryUserTagsByAccountIdByModeResult => {
  const privateQuery = useGetPrivateImageTagsByAccountId(
    accountId,
    params as GetPrivateImageTagsByAccountIdParams,
    {
      query: {
        enabled: mode === "private" && (options?.query?.enabled ?? true),
      },
    },
  );

  const publicQuery = useGetPublicImageTagsByAccountId(
    accountId,
    params as GetPublicImageTagsByAccountIdParams,
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
