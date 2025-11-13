import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { CreateSourcecodePayload } from "@/types/sourcecode/sourcecode.type";

/**
 * 소스코드 생성
 */
export const useCreateSourcecode = (): UseMutationResult<
  any,
  Error,
  CreateSourcecodePayload,
  unknown
> => {
  const { sourcecodeService } = useServices();

  return useMutation({
    mutationFn: (payload: CreateSourcecodePayload): Promise<any> => {
      return sourcecodeService.createSourcecode(payload);
    },
    onSuccess: () => {},
  });
};

