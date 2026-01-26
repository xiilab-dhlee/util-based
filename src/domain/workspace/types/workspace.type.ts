import type { RequestResourceStatus } from "@/domain/request-resource/constants/request-resource.constant";
import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

// 워크스페이스 리소스 요청 상태 타입 (Orval 생성 타입 재사용)
export type WorkspaceRequestResourceStatus = RequestResourceStatus;

export interface GetWorkspacesPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
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

export interface CreateWorkspaceRequestResourcePayload {
  [key: string]: unknown;
}

export interface UpdateWorkspaceRequestResourcePayload {
  [key: string]: unknown;
}

export interface DeleteWorkspaceRequestResourcePayload {
  id: string;
}
