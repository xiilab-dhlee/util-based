import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { storageSettingKeys } from "@/domain/system-setting/constants/storage-setting.key";
import type {
  StorageSettingDetailType,
  StorageSettingIdType,
} from "@/domain/system-setting/schemas/storage-setting.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 스토리지 설정 상세 조회
 */
export const useGetStorageDetail = (
  id: StorageSettingIdType,
): UseQueryResult<StorageSettingDetailType, Error> => {
  const { storageSettingService } = useServices();

  return useQuery({
    queryKey: storageSettingKeys.detail(id),
    queryFn: async () => {
      const response = await storageSettingService.getDetail(id);
      return response.data;
    },
    enabled: !!id,
  });
};
