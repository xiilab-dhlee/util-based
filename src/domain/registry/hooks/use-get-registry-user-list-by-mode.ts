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
  PageResponsePublicImageUsageResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

export type GetRegistryUserListParams =
  | GetPrivateImageUsageByAccountParams
  | GetPublicImageUsageByAccountParams;

export type GetRegistryUserListQueryError =
  | GetPrivateImageUsageByAccountQueryError
  | GetPublicImageUsageByAccountQueryError;

interface UseGetRegistryUserListByModeOptions {
  query?: {
    enabled?: boolean;
  };
}

interface UseGetRegistryUserListByModeResult {
  data:
    | PageResponsePrivateImageUsageResponse
    | PageResponsePublicImageUsageResponse
    | undefined;
  isLoading: boolean;
  isError: boolean;
  error: GetRegistryUserListQueryError | null;
  refetch: () => void;
}

/** mode에 따라 private 또는 public 사용자별 사용 현황 조회 */
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
