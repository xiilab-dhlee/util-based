"use client";

import { useAdminUpdateSourceCode } from "@/api/generated/admin-sourcecode/admin-sourcecode";
import type { UpdateSourceCodeRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useUpdateSourceCode } from "@/api/generated/source-code/source-code";
import type { SourcecodeMode } from "@/domain/sourcecode/types/sourcecode.type";

/** 소스코드 수정 응답 타입 */
export interface UpdateSourcecodeResponse {
  sourceCodeId: number;
}

interface UseUpdateSourcecodeByModeResult {
  mutate: (
    variables: { sourceCodeId: number; data: UpdateSourceCodeRequest },
    options?: {
      onSuccess?: (data: UpdateSourcecodeResponse) => void;
      onError?: (error: unknown) => void;
    },
  ) => void;
  isPending: boolean;
}

/** mode에 따라 user 또는 admin 소스코드 수정 */
export const useUpdateSourcecodeByMode = (
  mode: SourcecodeMode,
): UseUpdateSourcecodeByModeResult => {
  const userMutation = useUpdateSourceCode();
  const adminMutation = useAdminUpdateSourceCode();

  const mutation = mode === "user" ? userMutation : adminMutation;

  return {
    mutate: (variables, options) => {
      mutation.mutate(variables, {
        onSuccess: (data) => {
          options?.onSuccess?.(data as unknown as UpdateSourcecodeResponse);
        },
        onError: options?.onError,
      });
    },
    isPending: mutation.isPending,
  };
};
