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

export type GetRegistryUserTagsParams =
  | GetPrivateImageTagsByAccountIdParams
  | GetPublicImageTagsByAccountIdParams;

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

/** mode에 따라 private 또는 public 사용자별 이미지 태그 목록 조회 */
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
