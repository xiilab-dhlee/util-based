import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { SourcecodeIdType } from "@/domain/sourcecode/schemas/sourcecode.schema";
import { useServices } from "@/shared/providers/service-provider";

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
