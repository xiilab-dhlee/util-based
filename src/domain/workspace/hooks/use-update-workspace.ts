import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { UpdateWorkspacePayload } from "@/domain/workspace/types/workspace.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 워크스페이스 수정
 */
export const useUpdateWorkspace = (): UseMutationResult<
  unknown,
  Error,
  UpdateWorkspacePayload
> => {
  const { workspaceService } = useServices();

  return useMutation({
    mutationFn: async (payload: UpdateWorkspacePayload) => {
      return await workspaceService.updateWorkspace(payload);
    },
  });
};
