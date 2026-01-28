import type { WorkloadStatusResponseWorkloadStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { ACTIVE_WORKLOAD_STATUS_OPTIONS } from "@/domain/workload/constants/workload.constant";
import type { AllOptionValue } from "@/shared/constants/core.constant";
import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

/**
 * Active workload statuses (excluding terminated states)
 * Aligned with ACTIVE_WORKLOAD_STATUS_OPTIONS constant
 */
export type ActiveWorkloadStatusValue =
  (typeof ACTIVE_WORKLOAD_STATUS_OPTIONS)[number]["value"];

/**
 * Filter value for active workload status dropdown (includes ALL_OPTION.value)
 */
export type ActiveWorkloadFilterStatusValue =
  | ActiveWorkloadStatusValue
  | AllOptionValue;

/**
 * @deprecated Use ActiveWorkloadFilterStatusValue instead
 * 필터에서 사용되는 워크로드 상태 값 타입 (ALL_OPTION.value 포함)
 */
export type FilterStatusValue =
  | WorkloadStatusResponseWorkloadStatus
  | AllOptionValue;

export type WorkloadFileIndentPosition = "first" | "middle" | "last";

/**
 * @deprecated
 * 밑으로 다
 */
export interface GetWorkloadsPayload
  extends CorePayload,
    Partial<CorePaginate>,
    CoreSearchText {
  jobType?: string;
  status?: WorkloadStatusResponseWorkloadStatus;
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
