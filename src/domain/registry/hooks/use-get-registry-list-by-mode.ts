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

type GetRegistryListQueryError =
  | GetPrivateRegistryListQueryError
  | GetPublicRegistryListQueryError;

export type GetRegistryListParams =
  | GetPrivateRegistryListParams
  | GetPublicRegistryListParams;

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

/** mode에 따라 private 또는 public 레지스트리 목록 조회 */
export const useGetRegistryListByMode = (
  mode: RegistryMode,
  params: GetRegistryListParams,
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
