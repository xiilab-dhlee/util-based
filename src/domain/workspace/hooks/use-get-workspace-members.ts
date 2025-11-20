import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { workspaceKeys } from "@/domain/workspace/constants/workspace.key";
import type { GetWorkspaceMembersPayload } from "@/domain/workspace/types/workspace.interface";
import type { WorkspaceMemberListType } from "@/domain/workspace-member/schemas/workspace-member.schema";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 워크스페이스 멤버 목록 조회
 */
export const useGetWorkspaceMembers = (
  payload: GetWorkspaceMembersPayload,
): UseQueryResult<CoreListResponse<WorkspaceMemberListType>, Error> => {
  const { workspaceService } = useServices();

  return useQuery({
    queryKey: workspaceKeys.memberList(payload),
    queryFn: async () => {
      const response = await workspaceService.getMemberList(payload);
      return response.data;
    },
  });
};
