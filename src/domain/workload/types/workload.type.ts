import type {
  WorkloadJobType,
  WorkloadStatusType,
} from "@/domain/workload/schemas/workload.schema";
import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

export type WorkloadFileIndentPosition = "first" | "middle" | "last";

export interface GetWorkloadsPayload
  extends CorePayload,
    Partial<CorePaginate>,
    CoreSearchText {
  jobType?: WorkloadJobType;
  status?: WorkloadStatusType;
}

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

export interface StopWorkloadPayload extends CorePayload {}

export interface RestartWorkloadPayload extends CorePayload {}

export interface CreateCommitImagePayload extends CorePayload {}

export interface CreateWorkloadFolderPayload {
  workspaceId: string;
  workloadId: string;
  path: string;
  folderName: string;
}
