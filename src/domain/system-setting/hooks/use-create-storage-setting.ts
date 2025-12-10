import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { storageSettingKeys } from "@/domain/system-setting/constants/storage-setting.key";
import type { CreateStorageSettingRequestPayload } from "@/domain/system-setting/schemas/storage-setting.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 스토리지 설정 생성
 */
export const useCreateStorageSetting = (): UseMutationResult<
  unknown,
  Error,
  CreateStorageSettingRequestPayload,
  unknown
> => {
  const { storageSettingService } = useServices();

  return useMutation({
    mutationKey: storageSettingKeys.create(),
    mutationFn: (payload: CreateStorageSettingRequestPayload) => {
      return storageSettingService.create(payload).then((res) => res.data);
    },
  });
};
