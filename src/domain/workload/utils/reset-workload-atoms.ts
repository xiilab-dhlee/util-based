import type { WritableAtom } from "jotai";

import {
  WORKLOAD_JOB_TYPES,
  WORKLOAD_NODE_MODES,
} from "@/domain/workload/constants/workload.constant";
import {
  distributedTypeAtom,
  envsAtom,
  execCommandAtom,
  execPathAtom,
  executionCmdAtom,
  executionDirectoryAtom,
  harborImageNameAtom,
  imageTagNameAtom,
  imageTypeAtom,
  jobTypeAtom,
  labelsAtom,
  nodeModeAtom,
  nodeNameAtom,
  outputDirectoryAtom,
  parameterAtom,
  portsAtom,
  resourcePresetIdAtom,
  sourcecodeParametersAtom,
  stepAtom,
  workerCountAtom,
  workloadDescriptionAtom,
  workloadNameAtom,
  workloadSourcecodeInfoMapUiAtom,
  workloadSourcecodesAtom,
  workloadVolumeInfoMapUiAtom,
  workloadVolumesAtom,
} from "@/domain/workload/state/create-workload.atom";

/**
 * 모든 워크로드 생성 atom을 초기값으로 리셋합니다.
 * 워크로드 복제 시 기존 데이터를 덮어쓰기 위해 사용됩니다.
 *
 * @param setAtom - Jotai setAtom 함수
 */
export function resetAllWorkloadAtoms(
  setAtom: <Value, Args extends unknown[], Result>(
    atom: WritableAtom<Value, Args, Result>,
    ...args: Args
  ) => Result,
): void {
  // Step 관리
  setAtom(stepAtom, 0);

  // Step 0: Job Type & Meta Data
  setAtom(jobTypeAtom, WORKLOAD_JOB_TYPES.BATCH);
  setAtom(workloadNameAtom, "");
  setAtom(workloadDescriptionAtom, "");
  setAtom(labelsAtom, []);

  // Step 1: Resource
  setAtom(nodeModeAtom, WORKLOAD_NODE_MODES.SINGLE);
  setAtom(nodeNameAtom, null);
  setAtom(resourcePresetIdAtom, null);
  setAtom(workerCountAtom, null);
  setAtom(distributedTypeAtom, null);

  // Step 2: Image
  setAtom(harborImageNameAtom, "");
  setAtom(imageTagNameAtom, "");
  setAtom(imageTypeAtom, null);

  // Step 3: Task
  setAtom(workloadSourcecodesAtom, []);
  setAtom(workloadSourcecodeInfoMapUiAtom, {});
  setAtom(workloadVolumesAtom, []);
  setAtom(workloadVolumeInfoMapUiAtom, {});
  setAtom(sourcecodeParametersAtom, []);

  // Step 4: Command & Variables
  setAtom(outputDirectoryAtom, null);
  setAtom(executionDirectoryAtom, null);
  setAtom(executionCmdAtom, null);
  setAtom(parameterAtom, []);
  setAtom(envsAtom, []);
  setAtom(portsAtom, []);

  // Legacy atoms
  setAtom(execPathAtom, null);
  setAtom(execCommandAtom, null);
}
