import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { UpdateWorkspacePayload } from "@/types/workspace/workspace.interface";

/**
 * 워크스페이스 수정
 */
export const useUpdateWorkspace = (): UseMutationResult<
  any,
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

