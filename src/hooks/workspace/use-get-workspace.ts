import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workspaceKeys } from "@/constants/workspace/workspace.key";
import { useServices } from "@/providers/service-provider";
import type { WorkspaceDetailType } from "@/schemas/workspace.schema";

/**
 * 워크스페이스 상세 조회
 */
export const useGetWorkspace = (
  id: string,
): UseQueryResult<WorkspaceDetailType, Error> => {
  const { workspaceService } = useServices();

  return useQuery({
    queryKey: workspaceKeys.detail(id),
    queryFn: async () => {
      const response = await workspaceService.getDetail(id);
      return response.data;
    },
  });
};
