import { atom } from "jotai";

import type {
  WorkloadEnvType,
  WorkloadImageType,
  WorkloadJobType,
  WorkloadPortType,
  WorkloadSourcecodeType,
  WorkloadVolumeType,
} from "@/domain/workload/schemas/workload.schema";
import type {
  GpuListType,
  GpuNodeListType,
  GpuProfileListType,
} from "@/shared/schemas/gpu.schema";

// Step
export const stepAtom = atom(0);

// Step 0: Job Type & Meta Data
export const jobTypeAtom = atom<WorkloadJobType>("BATCH");
export const workloadNameAtom = atom("");
export const workloadDescriptionAtom = atom("");

// Step 1: Resource - Common
export const nodeModeAtom = atom<"single" | "multi">("single");
// export const labelsAtom = atom<string[]>(["test1", "test2"]);
export const gpuEnabledAtom = atom(false);
export const gpuAtom = atom<GpuListType | null>(null);
export const gpuNodeAtom = atom<GpuNodeListType | null>(null);
export const gpuProfileAtom = atom<GpuProfileListType | null>(null);

// Step 2: Resource - Single Mode
export const gpuCountAtom = atom(2);
export const cpuCoreAtom = atom(1);
export const memoryGbAtom = atom(4);
// Step 2: Resource - Multi Mode
export const launcherCpuCoreAtom = atom(2);
export const launcherMemoryGbAtom = atom(4);
export const workerGpuCountAtom = atom(2);
export const workerCpuCoreAtom = atom(123);
export const workerMemoryGbAtom = atom(82);
export const imageTypeAtom = atom<WorkloadImageType | null>(null);
export const imageIdAtom = atom<string | null>(null);
export const imageTagIdAtom = atom<string | null>(null);
// step 3: Task
export const workloadSourcecodesAtom = atom<WorkloadSourcecodeType[]>([]);
export const workloadVolumesAtom = atom<WorkloadVolumeType[]>([]);
export const workloadOutputPathAtom = atom<string | null>(null);

// step 4: Command
export const execPathAtom = atom<string | null>(null);
export const execCommandAtom = atom<string | null>(null);
// step 4: Variables
export const envsAtom = atom<Partial<WorkloadEnvType>[]>([]);
export const portsAtom = atom<Partial<WorkloadPortType>[]>([]);
// step 4: Time Prediction Parameter
export const trainImageNumAtom = atom<string | null>(null);
export const validationImageNumAtom = atom<string | null>(null);
export const imageSizeAtom = atom<string | null>(null);
export const batchSizeAtom = atom<string | null>(null);
export const modelParameterAtom = atom<string | null>(null);
export const epochAtom = atom<string | null>(null);
