import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "../common/api.interface";

// 워크스페이스 리소스 요청 상태 타입
export type WorkspaceRequestResourceStatus = "WAITING" | "APPROVE" | "REJECT";

export interface GetWorkspacesPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {
  isMyWorkspace?: boolean;
}

export interface CreateWorkspacePayload {
  [key: string]: unknown;
}

export interface UpdateWorkspacePayload {
  [key: string]: unknown;
}

export interface DeleteWorkspacePayload {
  id: string;
}

export interface GetWorkspaceMembersPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}

export interface CreateWorkspaceMemberPayload {
  [key: string]: unknown;
}

export interface UpdateWorkspaceMemberPayload {
  [key: string]: unknown;
}

export interface DeleteWorkspaceMemberPayload {
  id: string;
}

export interface GetWorkspaceRequestResourcesPayload
  extends CorePayload,
    CorePaginate {}

export interface CreateWorkspaceRequestResourcePayload {
  [key: string]: unknown;
}

export interface UpdateWorkspaceRequestResourcePayload {
  [key: string]: unknown;
}

export interface DeleteWorkspaceRequestResourcePayload {
  id: string;
}
