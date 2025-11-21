import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workspaceKeys } from "@/domain/workspace/constants/workspace.key";
import type { WorkspaceListType } from "@/domain/workspace/schemas/workspace.schema";
import type { GetWorkspacesPayload } from "@/domain/workspace/types/workspace.type";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

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
