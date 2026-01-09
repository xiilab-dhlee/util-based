import type {
  WorkloadJobType,
  WorkloadStatusType,
} from "@/domain/workload/schemas/workload.schema";
import type { AllOptionValue } from "@/shared/constants/core.constant";
import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

/** 필터에서 사용되는 워크로드 상태 값 타입 (전체 옵션 포함) */
export type FilterStatusValue = WorkloadStatusType | AllOptionValue;

export type WorkloadFileIndentPosition = "first" | "middle" | "last";

export interface GetWorkloadsPayload
  extends CorePayload,
    Partial<CorePaginate>,
    CoreSearchText {
  jobType?: WorkloadJobType;
  status?: WorkloadStatusType;
}

export interface GetWorkloadPayload extends CorePayload {
  workspaceId: number | string;
  workloadId: string;
}

export interface GetWorkloadFilesPayload extends CorePayload {
  workspaceId: number | string;
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
  workspaceId: number | string;
  workloadId: string;
  path: string;
  folderName: string;
}
