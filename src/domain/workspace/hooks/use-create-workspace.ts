import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { CreateWorkspacePayload } from "@/domain/workspace/types/workspace.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 워크스페이스 생성
 */
export const useCreateWorkspace = (): UseMutationResult<
  unknown,
  Error,
  CreateWorkspacePayload,
  unknown
> => {
  const { workspaceService } = useServices();

  return useMutation({
    mutationFn: (payload: CreateWorkspacePayload) => {
      return workspaceService.updateWorkspace(payload);
    },
    onSuccess: () => {},
  });
};
