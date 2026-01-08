import type { WorkspaceResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

export const selectInitialWorkspace = (
  workspaces: WorkspaceResponse[],
  storedId?: number,
): WorkspaceResponse => {
  if (storedId) {
    const stored = workspaces.find((ws) => ws.workspaceId === storedId);
    if (stored) return stored;
  }

  const defaultWorkspace = workspaces.find((ws) => ws.isDefault);
  if (defaultWorkspace) return defaultWorkspace;

  return workspaces[0];
};
