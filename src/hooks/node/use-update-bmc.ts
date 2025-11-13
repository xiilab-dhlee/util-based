import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { UpdateBmcPayload } from "@/types/node/redfish.interface";

/**
 * BMC 수정
 */
export const useUpdateBmc = (): UseMutationResult<
  any,
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

