import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { UpdateWorkspaceMemberPayload } from "@/types/workspace/workspace.interface";

/**
 * 워크스페이스 멤버 수정
 */
export const useUpdateWorkspaceMember = (): UseMutationResult<
  unknown,
  Error,
  UpdateWorkspaceMemberPayload
> => {
  const { workspaceService } = useServices();

  return useMutation({
    mutationFn: async (payload: UpdateWorkspaceMemberPayload) => {
      return await workspaceService.updateWorkspaceMember(payload);
    },
  });
};
