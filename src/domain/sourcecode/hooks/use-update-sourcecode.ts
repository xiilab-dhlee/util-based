import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { UpdateSourcecodePayload } from "@/domain/sourcecode/types/sourcecode.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 소스코드 수정
 */
export const useUpdateSourcecode = (): UseMutationResult<
  unknown,
  Error,
  UpdateSourcecodePayload,
  unknown
> => {
  const { sourcecodeService } = useServices();

  return useMutation({
    mutationFn: (payload: UpdateSourcecodePayload) => {
      return sourcecodeService.updateSourcecode(payload);
    },
    onSuccess: () => {},
  });
};
