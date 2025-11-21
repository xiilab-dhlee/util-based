import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workspaceKeys } from "@/domain/workspace/constants/workspace.key";
import type { GetWorkspaceRequestResourcesPayload } from "@/domain/workspace/types/workspace.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";
import type { RequestResourceListType } from "../schemas/request-resource.schema";

/**
 * 리소스 요청 목록 조회
 */
export const useGetRequestResources = (
  payload: GetWorkspaceRequestResourcesPayload,
): UseQueryResult<CoreListResponse<RequestResourceListType>, Error> => {
  const { workspaceService } = useServices();

  return useQuery({
    queryKey: workspaceKeys.requestResourceList(payload),
    queryFn: async () => {
      const response = await workspaceService.getRequestResourceList(payload);
      return response.data;
    },
  });
};
