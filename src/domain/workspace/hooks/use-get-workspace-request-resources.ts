import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { RequestResourceListType } from "@/domain/request-resource/schemas/request-resource.schema";
import { workspaceKeys } from "@/domain/workspace/constants/workspace.key";
import type { GetWorkspaceRequestResourcesPayload } from "@/domain/workspace/types/workspace.interface";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 워크스페이스 리소스 요청 목록 조회
 */
export const useGetWorkspaceRequestResources = (
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
