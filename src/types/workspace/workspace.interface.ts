import type { CorePaginate, CoreSearchText } from "../common/api.interface";

// 워크스페이스 리소스 요청 상태 타입
export type WorkspaceRequestResourceStatus = "WAITING" | "APPROVE" | "REJECT";

export interface GetWorkspacesPayload extends CorePaginate, CoreSearchText {
  isMyWorkspace?: boolean;
}

export interface CreateWorkspacePayload {
  [key: string]: any;
}

export interface UpdateWorkspacePayload {
  [key: string]: any;
}

export interface DeleteWorkspacePayload {
  id: string;
}

export interface GetWorkspaceMembersPayload
  extends CorePaginate,
    CoreSearchText {}

export interface CreateWorkspaceMemberPayload {
  [key: string]: any;
}

export interface UpdateWorkspaceMemberPayload {
  [key: string]: any;
}

export interface DeleteWorkspaceMemberPayload {
  id: string;
}

export interface GetWorkspaceRequestResourcesPayload extends CorePaginate {}

export interface CreateWorkspaceRequestResourcePayload {
  [key: string]: any;
}

export interface UpdateWorkspaceRequestResourcePayload {
  [key: string]: any;
}

export interface DeleteWorkspaceRequestResourcePayload {
  id: string;
}
