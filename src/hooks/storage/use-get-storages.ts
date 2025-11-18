import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { storageKeys } from "@/constants/storage/storage.key";
import { useServices } from "@/providers/service-provider";
import type { StorageListType } from "@/schemas/storage.schema";
import type { CoreListResponse } from "@/types/common/core.model";

/**
 * 스토리지 전체 목록 조회
 */
export const useGetAllStorages = (): UseQueryResult<
  CoreListResponse<StorageListType>,
  Error
> => {
  const { storageService } = useServices();

  return useQuery({
    queryKey: storageKeys.listAll(),
    queryFn: async () => {
      const response = await storageService.getList({
        page: 1,
        size: 100,
      });
      return response.data;
    },
  });
};
