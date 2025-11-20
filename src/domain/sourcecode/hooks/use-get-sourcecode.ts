import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { sourcecodeKeys } from "@/domain/sourcecode/constants/sourcecode.key";
import type {
  SourcecodeDetailType,
  SourcecodeIdType,
} from "@/domain/sourcecode/schemas/sourcecode.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 소스코드 상세 조회
 */
export const useGetSourcecode = (
  id: SourcecodeIdType,
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
