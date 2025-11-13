import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { CreateWorkspacePayload } from "@/types/workspace/workspace.interface";

/**
 * 워크스페이스 생성
 */
export const useCreateWorkspace = (): UseMutationResult<
  any,
  Error,
  CreateWorkspacePayload,
  unknown
> => {
  const { workspaceService } = useServices();

  return useMutation({
    mutationFn: (payload: CreateWorkspacePayload): Promise<any> => {
      return workspaceService.updateWorkspace(payload);
    },
    onSuccess: () => {},
  });
};

