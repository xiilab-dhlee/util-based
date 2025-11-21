import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { GetWorkspaceMembersPayload } from "@/domain/workspace/types/workspace.type";
import type { WorkspaceMemberListType } from "@/domain/workspace-member/schemas/workspace-member.schema";
import { useServices } from "@/shared/providers/service-provider";
import type { CoreListResponse } from "@/shared/types/core.model";
import { settingKeys } from "../constants/setting.key";

/**
 * 설정 워크스페이스 멤버 목록 조회
 */
export const useGetSettingWorkspaceMembers = (
  payload: GetWorkspaceMembersPayload,
): UseQueryResult<CoreListResponse<WorkspaceMemberListType>, Error> => {
  const { workspaceService } = useServices();

  return useQuery({
    queryKey: settingKeys.memberList(payload),
    queryFn: async () => {
      const response = await workspaceService.getMemberList(payload);
      return response.data;
    },
  });
};
