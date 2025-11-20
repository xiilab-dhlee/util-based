import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { sourcecodeKeys } from "@/domain/sourcecode/constants/sourcecode.key";
import type { SourcecodeListType } from "@/domain/sourcecode/schemas/sourcecode.schema";
import type { GetSourcecodesPayload } from "@/domain/sourcecode/types/sourcecode.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 소스코드 목록 조회
 *
 */
export const useGetSourcecodes = (
  payload: GetSourcecodesPayload,
): UseQueryResult<CoreListResponse<SourcecodeListType>, Error> => {
  const { sourcecodeService } = useServices();

  return useQuery({
    queryKey: sourcecodeKeys.list(payload),
    queryFn: async () => {
      const response = await sourcecodeService.getList(payload);
      return response.data;
    },
  });
};
