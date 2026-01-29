import type {
  ActiveWorkloadResponseWorkloadJobType,
  EnvRequest,
  PortRequest,
  SourceCodeRequest,
  VolumeRequest,
  WorkloadCreateRequestNodeType,
  WorkloadStatusResponseWorkloadStatus,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { ACTIVE_WORKLOAD_STATUS_OPTIONS } from "@/domain/workload/constants/workload.constant";
import type { AllOptionValue } from "@/shared/constants/core.constant";

/**
 * Re-export types from generated API for cleaner imports
 */
export type WorkloadJobType = ActiveWorkloadResponseWorkloadJobType;
export type WorkloadNodeMode = WorkloadCreateRequestNodeType;
export type WorkloadImageType = string;
export type WorkloadEnvType = EnvRequest;
export type WorkloadPortType = PortRequest;
export type WorkloadSourcecodeType = SourceCodeRequest;
export type WorkloadVolumeType = VolumeRequest;

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
 * 워크로드 생성 요청 타입 (API 스펙: WorkloadCreateRequest 기준)
 */
export interface CreateWorkloadPayload {
  workloadName: string;
  description?: string;
  label?: string[];
  workloadJobType: WorkloadJobType;
  nodeType: WorkloadNodeMode;
  nodeName?: string;
  resourcePresetId: number;
  harborImageName: string;
  imageTagName: string;
  outputDirectory?: string;
  executionDirectory?: string;
  executionCmd?: string;
  env?: WorkloadEnvType[];
  port?: WorkloadPortType[];
  sourceCode?: WorkloadSourcecodeType;
  volume?: WorkloadVolumeType[];
  parameter?: { [key: string]: unknown }[];
  workerCount?: number;
}

export interface CreateWorkloadFolderPayload {
  workspaceId: number | string;
  workloadId: string;
  path: string;
  folderName: string;
}
