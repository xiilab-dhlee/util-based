import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { UpdateWorkspaceMemberPayload } from "@/domain/workspace/types/workspace.interface";
import { useServices } from "@/shared/providers/service-provider";

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
