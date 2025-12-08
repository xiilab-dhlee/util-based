import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { hpeKeys } from "@/domain/system-setting/constants/hpe.key";
import type { HpeDetailType } from "@/domain/system-setting/schemas/hpe.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * HPE 정보 조회 훅
 * @returns HPE 정보 조회 쿼리 결과
 */
export const useGetHpe = (): UseQueryResult<HpeDetailType | null, Error> => {
  const { hpeService } = useServices();

  return useQuery({
    queryKey: hpeKeys.default,
    queryFn: async () => {
      const response = await hpeService.getHpe();
      return response.data;
    },
  });
};
