import { atom } from "jotai";

import type {
  WorkloadImageType,
  WorkloadJobType,
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

// Step 1: Resource - Single Mode
export const gpuCountAtom = atom(2);
export const cpuCoreAtom = atom(1);
export const memoryGbAtom = atom(4);

// Step 1: Resource - Multi Mode
export const launcherCpuCoreAtom = atom(2);
export const launcherMemoryGbAtom = atom(4);
export const workerGpuCountAtom = atom(2);
export const workerCpuCoreAtom = atom(123);
export const workerMemoryGbAtom = atom(82);
export const imageTypeAtom = atom<WorkloadImageType | null>(null);
export const imageIdAtom = atom<string | null>(null);
export const imageTagIdAtom = atom<string | null>(null);
