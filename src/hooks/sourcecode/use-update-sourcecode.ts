import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { UpdateSourcecodePayload } from "@/types/sourcecode/sourcecode.type";

/**
 * 소스코드 수정
 */
export const useUpdateSourcecode = (): UseMutationResult<
  any,
  Error,
  UpdateSourcecodePayload,
  unknown
> => {
  const { sourcecodeService } = useServices();

  return useMutation({
    mutationFn: (payload: UpdateSourcecodePayload): Promise<any> => {
      return sourcecodeService.updateSourcecode(payload);
    },
    onSuccess: () => {},
  });
};

