import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";
import type { WorkspaceIdType } from "@/schemas/workspace.schema";

/**
 * 워크스페이스 삭제
 */
export const useDeleteWorkspace = (): UseMutationResult<
  unknown,
  Error,
  WorkspaceIdType[],
  unknown
> => {
  const { workspaceService } = useServices();

  return useMutation({
    mutationFn: (workspaces: WorkspaceIdType[]) => {
      return workspaceService.deleteWorkspace(workspaces);
    },
    onSuccess: () => {},
  });
};
