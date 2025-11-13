import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import workspaceKeys from "@/constants/workspace/workspace.key";
import { useServices } from "@/providers/service-provider";
import type { GetWorkspaceRequestResourcesPayload } from "@/types/workspace/workspace.interface";

/**
 * 워크스페이스 리소스 요청 목록 조회
 */
export const useGetWorkspaceRequestResources = (
  payload: GetWorkspaceRequestResourcesPayload,
): UseQueryResult<any, Error> => {
  const { workspaceService } = useServices();

  return useQuery({
    queryKey: workspaceKeys.requestResourceList(payload),
    queryFn: async () => {
      const response = await workspaceService.getRequestResourceList(payload);
      return response.data;
    },
  });
};

