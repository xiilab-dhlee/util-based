import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import workspaceKeys from "@/constants/workspace/workspace.key";
import { useServices } from "@/providers/service-provider";
import type { GetWorkspaceMembersPayload } from "@/types/workspace/workspace.interface";

/**
 * 워크스페이스 멤버 목록 조회
 */
export const useGetWorkspaceMembers = (
  payload: GetWorkspaceMembersPayload,
): UseQueryResult<any, Error> => {
  const { workspaceService } = useServices();

  return useQuery({
    queryKey: workspaceKeys.memberList(payload),
    queryFn: async () => {
      const response = await workspaceService.getMemberList(payload);
      return response.data;
    },
  });
};

