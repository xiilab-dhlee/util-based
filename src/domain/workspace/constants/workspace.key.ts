import type {
  GetWorkspaceMembersPayload,
  GetWorkspacesPayload,
} from "@/domain/workspace/types/workspace.type";

export const workspaceKeys = {
  default: ["workspace"],
  list: (payload: GetWorkspacesPayload) => [
    ...workspaceKeys.default,
    "list",
    payload,
  ],
  detail: (id: string) => [...workspaceKeys.default, "detail", id],
  memberList: (payload: GetWorkspaceMembersPayload) => [
    ...workspaceKeys.default,
    "memberList",
    payload,
  ],
};
