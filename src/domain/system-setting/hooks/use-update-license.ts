import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { licenseKeys } from "@/domain/system-setting/constants/license.key";
import type {
  LicenseDetailType,
  RenewLicenseRequestType,
} from "@/domain/system-setting/schemas/license.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 라이선스 등록 훅
 * @returns 라이선스 등록 mutation
 */
export const useUpdateLicense = (): UseMutationResult<
  LicenseDetailType,
  Error,
  RenewLicenseRequestType
> => {
  const { licenseService } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: licenseKeys.renew(),
    mutationFn: async (payload: RenewLicenseRequestType) => {
      const response = await licenseService.renewLicense(payload);
      return response.data;
    },
    onSuccess: () => {
      // 라이선스 목록 캐시 무효화하여 최신 데이터 refetch
      queryClient.invalidateQueries({ queryKey: licenseKeys.default });
    },
  });
};
