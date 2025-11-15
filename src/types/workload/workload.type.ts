import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/types/common/api.interface";

export type WorkloadFileIndentPosition = "first" | "middle" | "last";

export interface GetWorkloadsPayload
  extends CorePayload,
    Partial<CorePaginate>,
    CoreSearchText {}

export interface GetWorkloadPayload extends CorePayload {
  workspaceId: string;
  workloadId: string;
}

export interface GetWorkloadFilesPayload extends CorePayload {
  workspaceId: string;
  workloadId: string;
  path: string;
}

export interface GetWorkloadVulnerabilitiesPayload
  extends CorePayload,
    CorePaginate {}

export interface CreateWorkloadPayload extends CorePayload {}

export interface UpdateWorkloadPayload extends CorePayload {}

export interface DeleteWorkloadPayload extends CorePayload {}

export interface CreateCommitImagePayload extends CorePayload {}
