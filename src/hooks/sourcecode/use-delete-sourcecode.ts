import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { SourcecodeListType } from "@/schemas/sourcecode.schema";

/**
 * 소스코드 삭제
 */
export const useDeleteSourcecode = (): UseMutationResult<
  any,
  Error,
  Pick<SourcecodeListType, "id">[],
  unknown
> => {
  const { sourcecodeService } = useServices();

  return useMutation({
    mutationFn: (
      sourcecodes: Pick<SourcecodeListType, "id">[],
    ): Promise<any> => {
      return sourcecodeService.deleteSourcecode(sourcecodes);
    },
    onSuccess: () => {},
  });
};

