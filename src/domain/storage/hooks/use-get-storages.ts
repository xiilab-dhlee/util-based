import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { storageKeys } from "@/domain/storage/constants/storage.key";
import type { StorageListType } from "@/domain/storage/schemas/storage.schema";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

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
