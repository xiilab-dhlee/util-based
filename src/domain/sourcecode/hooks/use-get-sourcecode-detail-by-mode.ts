"use client";

import {
  type AdminGetSourceCodeDetailQueryError,
  useAdminGetSourceCodeDetail,
} from "@/api/generated/admin-sourcecode/admin-sourcecode";
import type { SourceCodeDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  type GetSourceCodeDetailQueryError,
  useGetSourceCodeDetail,
} from "@/api/generated/source-code/source-code";
import type { SourcecodeMode } from "@/domain/sourcecode/types/sourcecode.type";

type GetSourcecodeDetailByModeQueryError =
  | GetSourceCodeDetailQueryError
  | AdminGetSourceCodeDetailQueryError;

interface UseGetSourcecodeDetailByModeOptions {
  query?: {
    enabled?: boolean;
  };
}

interface UseGetSourcecodeDetailByModeResult {
  data: SourceCodeDetailResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: GetSourcecodeDetailByModeQueryError | null;
  refetch: () => void;
}

/** mode에 따라 user 또는 admin 소스코드 상세 조회 */
export const useGetSourcecodeDetailByMode = (
  mode: SourcecodeMode,
  sourceCodeId: number,
  options?: UseGetSourcecodeDetailByModeOptions,
): UseGetSourcecodeDetailByModeResult => {
  const userQuery = useGetSourceCodeDetail(sourceCodeId, {
    query: {
      enabled: mode === "user" && (options?.query?.enabled ?? true),
    },
  });

  const adminQuery = useAdminGetSourceCodeDetail(sourceCodeId, {
    query: {
      enabled: mode === "admin" && (options?.query?.enabled ?? true),
    },
  });

  const query = mode === "user" ? userQuery : adminQuery;

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
