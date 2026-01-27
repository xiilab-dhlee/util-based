"use client";

import {
  type AdminGetSourceCodeListQueryError,
  useAdminGetSourceCodeList,
} from "@/api/generated/admin-sourcecode/admin-sourcecode";
import type {
  AdminGetSourceCodeListParams,
  GetSourceCodeListParams,
  PageResponseSourceCodeListResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  type GetSourceCodeListQueryError,
  useGetSourceCodeList,
} from "@/api/generated/source-code/source-code";
import type { SourcecodeMode } from "@/domain/sourcecode/types/sourcecode.type";

type GetSourcecodeListByModeQueryError =
  | GetSourceCodeListQueryError
  | AdminGetSourceCodeListQueryError;

export type GetSourcecodeListByModeParams =
  | GetSourceCodeListParams
  | AdminGetSourceCodeListParams;

interface UseGetSourcecodeListByModeOptions {
  query?: {
    enabled?: boolean;
  };
}

interface UseGetSourcecodeListByModeResult {
  data: PageResponseSourceCodeListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: GetSourcecodeListByModeQueryError | null;
  refetch: () => void;
}

/** mode에 따라 user 또는 admin 소스코드 목록 조회 */
export const useGetSourcecodeListByMode = (
  mode: SourcecodeMode,
  params: GetSourcecodeListByModeParams,
  options?: UseGetSourcecodeListByModeOptions,
): UseGetSourcecodeListByModeResult => {
  const userQuery = useGetSourceCodeList(params as GetSourceCodeListParams, {
    query: {
      enabled: mode === "user" && (options?.query?.enabled ?? true),
    },
  });

  const adminQuery = useAdminGetSourceCodeList(
    params as AdminGetSourceCodeListParams,
    {
      query: {
        enabled: mode === "admin" && (options?.query?.enabled ?? true),
      },
    },
  );

  const query = mode === "user" ? userQuery : adminQuery;

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
