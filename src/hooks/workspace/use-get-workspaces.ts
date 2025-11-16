import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workspaceKeys } from "@/constants/workspace/workspace.key";
import { useServices } from "@/providers/service-provider";
import type { WorkspaceListType } from "@/schemas/workspace.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetWorkspacesPayload } from "@/types/workspace/workspace.interface";

/**
 * 워크스페이스 목록 조회
 */
export const useGetWorkspaces = (
  payload: GetWorkspacesPayload,
): UseQueryResult<CoreListResponse<WorkspaceListType>, Error> => {
  const { workspaceService } = useServices();

  return useQuery({
    queryKey: workspaceKeys.list(payload),
    queryFn: async () => {
      const response = await workspaceService.getList(payload);
      return response.data;
    },
  });
};
