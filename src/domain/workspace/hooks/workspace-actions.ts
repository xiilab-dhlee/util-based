import { useCreateWorkspace } from "@/api/generated/workspace/workspace";
import { useWorkspaceSwitch } from "@/domain/workspace/hooks/use-workspace-switch";

export function useCreateWorkspaceAction(
  options?: Parameters<typeof useCreateWorkspace>[0],
) {
  const { handleSelectWorkspace } = useWorkspaceSwitch();

  return useCreateWorkspace({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: async (data, ...rest) => {
        if (data) {
          await handleSelectWorkspace(data);
        }
        options?.mutation?.onSuccess?.(data, ...rest);
      },
    },
  });
}
