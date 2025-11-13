import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { CreateBmcPayload } from "@/types/node/redfish.interface";

/**
 * BMC 등록
 */
export const useCreateBmc = (): UseMutationResult<
  any,
  Error,
  CreateBmcPayload,
  unknown
> => {
  const { redfishBmcService } = useServices();

  return useMutation({
    mutationFn: (payload: CreateBmcPayload) => {
      return redfishBmcService.createBmc(payload);
    },
  });
};

