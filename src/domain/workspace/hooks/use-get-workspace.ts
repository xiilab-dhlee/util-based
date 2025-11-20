import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workspaceKeys } from "@/domain/workspace/constants/workspace.key";
import type { WorkspaceDetailType } from "@/domain/workspace/schemas/workspace.schema";
import { useServices } from "@/shared/providers/service-provider";

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
