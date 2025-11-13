import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import storageKeys from "@/constants/storage/storage.key";
import { useServices } from "@/providers/service-provider";
import type { Storage } from "@/types/storage/storage.model";

/**
 * 스토리지 전체 목록 조회
 */
export const useGetAllStorages = (): UseQueryResult<
  { storages: Storage[]; total: number },
  Error
> => {
  const { storageService } = useServices();

  return useQuery({
    queryKey: storageKeys.listAll(),
    queryFn: async () => {
      const { storages, total } = await storageService.getList({
        page: 1,
        size: 100,
      });
      return { storages, total };
    },
  });
};

