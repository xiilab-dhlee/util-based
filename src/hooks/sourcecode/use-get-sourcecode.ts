import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { sourcecodeKeys } from "@/constants/sourcecode/sourcecode.key";
import { useServices } from "@/providers/service-provider";
import type { SourcecodeDetailType } from "@/schemas/sourcecode.schema";

/**
 * 소스코드 상세 조회
 */
export const useGetSourcecode = (
  id: number,
): UseQueryResult<SourcecodeDetailType, Error> => {
  const { sourcecodeService } = useServices();

  return useQuery({
    queryKey: sourcecodeKeys.detail(id),
    queryFn: async () => {
      const response = await sourcecodeService.getDetail(id);
      return response.data;
    },
    enabled: id !== -1,
  });
};
