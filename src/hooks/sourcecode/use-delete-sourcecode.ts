import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { SourcecodeIdType } from "@/schemas/sourcecode.schema";

/**
 * 소스코드 삭제
 */
export const useDeleteSourcecode = (): UseMutationResult<
  unknown,
  Error,
  SourcecodeIdType[],
  unknown
> => {
  const { sourcecodeService } = useServices();

  return useMutation({
    mutationFn: (sourcecodes: SourcecodeIdType[]) => {
      return sourcecodeService.deleteSourcecode(sourcecodes);
    },
    onSuccess: () => {},
  });
};
