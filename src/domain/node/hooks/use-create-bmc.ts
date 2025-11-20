import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { CreateBmcPayload } from "@/domain/node/types/redfish.interface";
import { useServices } from "@/shared/providers/service-provider";

/**
 * BMC 등록
 */
export const useCreateBmc = (): UseMutationResult<
  unknown,
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
