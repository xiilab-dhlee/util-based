import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { licenseKeys } from "@/domain/system-setting/constants/license.key";
import type { LicenseListResponseType } from "@/domain/system-setting/schemas/license.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 라이선스 정보 조회 훅
 * 현재 활성 라이선스 + 등록 이력 조회
 * @returns 라이선스 목록 정보
 */
export const useGetLicense = (): UseQueryResult<
  LicenseListResponseType,
  Error
> => {
  const { licenseService } = useServices();

  return useQuery({
    queryKey: licenseKeys.list(),
    queryFn: async () => {
      const response = await licenseService.getLicense();
      return response.data;
    },
  });
};
