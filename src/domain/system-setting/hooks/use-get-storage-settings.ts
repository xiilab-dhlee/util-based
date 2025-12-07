import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { storageSettingKeys } from "@/domain/system-setting/constants/storage-setting.key";
import type { StorageSettingListType } from "@/domain/system-setting/schemas/storage-setting.schema";
import { useServices } from "@/shared/providers/service-provider";
import type { CorePayload } from "@/shared/types/api.interface";
import type { CoreListResponse } from "@/shared/types/core.model";

interface GetStorageSettingsPayload extends CorePayload {
  page: number;
  size: number;
}

/**
 * 스토리지 설정 목록 조회
 */
export const useGetStorageSettings = (
  payload: GetStorageSettingsPayload,
): UseQueryResult<CoreListResponse<StorageSettingListType>, Error> => {
  const { storageSettingService } = useServices();

  return useQuery({
    queryKey: storageSettingKeys.list(payload.page),
    queryFn: async () => {
      const response = await storageSettingService.getList(payload);
      return response.data;
    },
  });
};
