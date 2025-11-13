import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import workspaceKeys from "@/constants/workspace/workspace.key";
import { useServices } from "@/providers/service-provider";
import type { GetWorkspacesPayload } from "@/types/workspace/workspace.interface";

/**
 * 워크스페이스 목록 조회
 */
export const useGetWorkspaces = (
  payload: GetWorkspacesPayload,
): UseQueryResult<any, Error> => {
  const { workspaceService } = useServices();

  return useQuery({
    queryKey: workspaceKeys.list(payload),
    queryFn: async () => {
      const response = await workspaceService.getList(payload);
      return response.data;
    },
  });
};

