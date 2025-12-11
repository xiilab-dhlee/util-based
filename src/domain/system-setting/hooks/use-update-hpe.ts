import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { hpeKeys } from "@/domain/system-setting/constants/hpe.key";
import type {
  HpeDetailType,
  UpdateHpeRequestType,
} from "@/domain/system-setting/schemas/hpe.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * HPE 연동/수정 훅
 * @returns HPE 업데이트 mutation
 */
export const useUpdateHpe = (): UseMutationResult<
  HpeDetailType,
  Error,
  UpdateHpeRequestType
> => {
  const { hpeService } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: hpeKeys.update(),
    mutationFn: async (payload: UpdateHpeRequestType) => {
      const response = await hpeService.updateHpe(payload);
      return response.data;
    },
    onSuccess: () => {
      // HPE 정보 다시 조회
      queryClient.invalidateQueries({ queryKey: hpeKeys.default });
    },
  });
};
