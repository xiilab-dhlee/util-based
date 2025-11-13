import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import sourcecodeKeys from "@/constants/sourcecode/sourcecode.key";
import { useServices } from "@/providers/service-provider";
import type { GetSourcecodesPayload } from "@/types/sourcecode/sourcecode.type";

/**
 * 소스코드 목록 조회
 * 에러 처리는 전역 QueryClient에서 자동으로 처리됩니다.
 */
export const useGetSourcecodes = (
  payload: GetSourcecodesPayload,
): UseQueryResult<any, Error> => {
  const { sourcecodeService } = useServices();

  return useQuery({
    queryKey: sourcecodeKeys.list(payload),
    queryFn: async () => {
      const response = await sourcecodeService.getList(payload);
      return response.data;
    },
  });
};

