import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import workspaceKeys from "@/constants/workspace/workspace.key";
import { useServices } from "@/providers/service-provider";

/**
 * 워크스페이스 상세 조회
 */
export const useGetWorkspace = (
  id: string,
): UseQueryResult<{ workspace: any }, Error> => {
  const { workspaceService } = useServices();

  return useQuery({
    queryKey: workspaceKeys.detail(id),
    queryFn: async () => {
      const { workspace } = await workspaceService.getDetail(id);
      return { workspace };
    },
  });
};

