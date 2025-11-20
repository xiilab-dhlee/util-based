import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { UpdateBmcPayload } from "@/domain/node/types/redfish.interface";
import { useServices } from "@/shared/providers/service-provider";

/**
 * BMC 수정
 */
export const useUpdateBmc = (): UseMutationResult<
  unknown,
  Error,
  UpdateBmcPayload,
  unknown
> => {
  const { redfishBmcService } = useServices();

  return useMutation({
    mutationFn: (payload: UpdateBmcPayload) => {
      return redfishBmcService.updateBmc(payload);
    },
  });
};
