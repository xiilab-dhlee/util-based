import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { userResourceKeys } from "@/domain/monitoring/constants/monitoring.key";
import type { UserResourceSchemaType } from "@/domain/monitoring/schemas/user-resource.schema";
import type { GetUserResourcesPayload } from "@/domain/monitoring/types/monitoring.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 사용자별 리소스 점유율 목록 조회
 */
export const useGetUserResources = (
  payload: GetUserResourcesPayload,
): UseQueryResult<CoreListResponse<UserResourceSchemaType>, Error> => {
  const { userResourceService } = useServices();

  return useQuery({
    queryKey: userResourceKeys.list(payload),
    queryFn: async () => {
      const response = await userResourceService.getUserResources(payload);
      return response.data;
    },
  });
};
