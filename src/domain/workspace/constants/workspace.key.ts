import type {
  GetWorkspaceMembersPayload,
  GetWorkspaceRequestResourcesPayload,
  GetWorkspacesPayload,
} from "@/domain/workspace/types/workspace.type";

export const workspaceKeys = {
  default: ["workspace"],
  list: (payload: GetWorkspacesPayload) => [
    ...workspaceKeys.default,
    "list",
    ...Object.values(payload),
  ],
  detail: (id: string) => [...workspaceKeys.default, "detail", id],
  memberList: (payload: GetWorkspaceMembersPayload) => [
    ...workspaceKeys.default,
    "memberList",
    ...Object.values(payload),
  ],
  requestResourceList: (payload: GetWorkspaceRequestResourcesPayload) => [
    ...workspaceKeys.default,
    "requestResourceList",
    ...Object.values(payload),
  ],
};
