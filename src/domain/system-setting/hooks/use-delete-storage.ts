import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { storageSettingKeys } from "@/domain/system-setting/constants/storage-setting.key";
import type { StorageSettingIdType } from "@/domain/system-setting/schemas/storage-setting.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 스토리지 설정 삭제
 */
export const useDeleteStorage = (): UseMutationResult<
  unknown,
  Error,
  StorageSettingIdType,
  unknown
> => {
  const { storageSettingService } = useServices();

  return useMutation({
    mutationKey: storageSettingKeys.delete(),
    mutationFn: (id: StorageSettingIdType) => {
      return storageSettingService.delete(id);
    },
  });
};
