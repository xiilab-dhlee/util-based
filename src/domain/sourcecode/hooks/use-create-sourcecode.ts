import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { CreateSourcecodePayload } from "@/domain/sourcecode/types/sourcecode.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 소스코드 생성
 */
export const useCreateSourcecode = (): UseMutationResult<
  unknown,
  Error,
  CreateSourcecodePayload,
  unknown
> => {
  const { sourcecodeService } = useServices();

  return useMutation({
    mutationFn: (payload: CreateSourcecodePayload) => {
      return sourcecodeService.createSourcecode(payload);
    },
    onSuccess: () => {},
  });
};
