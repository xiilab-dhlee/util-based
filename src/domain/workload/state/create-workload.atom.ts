import { atom } from "jotai";

import type {
  SourceCodeListResponse,
  VolumeListResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { SourcecodeParameterType } from "@/domain/sourcecode/schemas/sourcecode.schema";
import {
  WORKLOAD_JOB_TYPES,
  WORKLOAD_NODE_MODES,
} from "@/domain/workload/constants/workload.constant";
import type {
  WorkloadEnvType,
  WorkloadImageType,
  WorkloadJobType,
  WorkloadNodeMode,
  WorkloadPortType,
  WorkloadSourcecodeType as WorkloadSourcecodeRequestType,
  WorkloadVolumeType,
} from "@/domain/workload/types/workload.type";

export type WorkloadPortFormType = Omit<
  WorkloadPortType,
  "portNumber" | "servicePortNum"
> & {
  portNumber: number;
  servicePortNum?: number;
};

// Step
export const stepAtom = atom(0);

// Step 0: Job Type & Meta Data
export const jobTypeAtom = atom<WorkloadJobType>(WORKLOAD_JOB_TYPES.BATCH);
export const workloadNameAtom = atom("");
export const workloadDescriptionAtom = atom("");
export const labelsAtom = atom<string[]>([]);

// Step 1: Resource - Common
export const nodeModeAtom = atom<WorkloadNodeMode>(WORKLOAD_NODE_MODES.SINGLE);
export const nodeNameAtom = atom<string | null>(null);
export const resourcePresetIdAtom = atom<number | null>(null);
export const workerCountAtom = atom<number | null>(null);
export const distributedTypeAtom = atom<string | null>(null);

// Step 2: Image
export const harborImageNameAtom = atom<string>("");
export const imageTagNameAtom = atom<string>("");

// Legacy atoms (for backwards compatibility during migration)
export const imageTypeAtom = atom<WorkloadImageType | null>(null);

// step 3: Task
export type WorkloadSourcecodeInfoUiType = Pick<
  SourceCodeListResponse,
  "sourceCodeId" | "sourceCodeName" | "gitUrl" | "mountPath" | "sourceCodeType"
> &
  Partial<Pick<SourceCodeListResponse, "isPublic">>;

export const workloadSourcecodesAtom = atom<WorkloadSourcecodeRequestType[]>(
  [],
);
export const workloadSourcecodeInfoMapUiAtom = atom<
  Record<number, WorkloadSourcecodeInfoUiType>
>({});
export type WorkloadVolumeInfoUiType = Pick<
  VolumeListResponse,
  "volumeId" | "volumeName" | "volumeType" | "mountPath"
> &
  Partial<Pick<VolumeListResponse, "fileSizeByte" | "isPublic">>;

export const workloadVolumesAtom = atom<WorkloadVolumeType[]>([]);
export const workloadVolumeInfoMapUiAtom = atom<
  Record<number, WorkloadVolumeInfoUiType>
>({});
export const sourcecodeParametersAtom = atom<SourcecodeParameterType[]>([]);

// step 4: Command
export const outputDirectoryAtom = atom<string | null>(null);
export const executionDirectoryAtom = atom<string | null>(null);
export const executionCmdAtom = atom<string | null>(null);
export const parameterAtom = atom<{ [key: string]: unknown }[]>([]);

// step 4: Variables
export const envsAtom = atom<WorkloadEnvType[]>([]);
export const portsAtom = atom<WorkloadPortFormType[]>([]);

// Legacy atoms (for backwards compatibility)
export const execPathAtom = atom<string | null>(null);
export const execCommandAtom = atom<string | null>(null);

// Derived atoms - Visibility & Validation Rules
export const isDistributedLearningAtom = atom((get) => {
  const jobType = get(jobTypeAtom);
  const nodeMode = get(nodeModeAtom);
  return (
    jobType === WORKLOAD_JOB_TYPES.BATCH &&
    nodeMode === WORKLOAD_NODE_MODES.MULTI
  );
});

/**
 * Hub 이미지 사용 가능 여부
 * Interactive 작업이거나 분산 학습일 때는 Hub 이미지를 사용할 수 없음
 */
export const canUseHubImageAtom = atom((get) => {
  const jobType = get(jobTypeAtom);
  const isDistributedLearning = get(isDistributedLearningAtom);
  return jobType !== WORKLOAD_JOB_TYPES.INTERACTIVE && !isDistributedLearning;
});

/**
 * Multi Node 사용 가능 여부
 * Interactive 작업에서는 Multi Node를 사용할 수 없음
 */
export const canUseMultiNodeAtom = atom((get) => {
  const jobType = get(jobTypeAtom);
  return jobType !== WORKLOAD_JOB_TYPES.INTERACTIVE;
});