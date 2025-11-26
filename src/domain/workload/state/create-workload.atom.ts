import { atom } from "jotai";

import type { WorkloadJobType } from "@/domain/workload/schemas/workload.schema";
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
export const labelsAtom = atom<string[]>(["test1", "test2"]);
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

// Reset Atom
export const resetWorkloadAtom = atom(null, (_get, set) => {
  set(stepAtom, 0);
  set(jobTypeAtom, "BATCH");
  set(workloadNameAtom, "");
  set(workloadDescriptionAtom, "");
  set(nodeModeAtom, "single");
  set(labelsAtom, ["test1", "test2"]);
  set(gpuEnabledAtom, false);
  set(gpuAtom, null);
  set(gpuNodeAtom, null);
  set(gpuProfileAtom, null);
  set(gpuCountAtom, 2);
  set(cpuCoreAtom, 1);
  set(memoryGbAtom, 4);
  set(launcherCpuCoreAtom, 2);
  set(launcherMemoryGbAtom, 4);
  set(workerGpuCountAtom, 2);
  set(workerCpuCoreAtom, 123);
  set(workerMemoryGbAtom, 82);
});
