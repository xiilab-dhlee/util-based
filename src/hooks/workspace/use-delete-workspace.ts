import { type UseMutationResult, useMutation } from "@tanstack/react-query";

import { useServices } from "@/providers/service-provider";

/**
 * 워크스페이스 삭제
 */
export const useDeleteWorkspace = (): UseMutationResult<
  any,
  Error,
  string[],
  unknown
> => {
  const { workspaceService } = useServices();

  return useMutation({
    mutationFn: (workspaces: string[]): Promise<any> => {
      return workspaceService.deleteWorkspace(workspaces);
    },
    onSuccess: () => {},
  });
};

