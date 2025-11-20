import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import type { WorkspaceIdType } from "@/domain/workspace/schemas/workspace.schema";
import { useServices } from "@/shared/providers/service-provider";

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
