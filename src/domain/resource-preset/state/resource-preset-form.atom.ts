import { atom } from "jotai";

import type {
  MultiNodeResource,
  ResourcePresetFormErrors,
  ResourcePresetFormType,
  SingleNodeResource,
} from "@/domain/resource-preset/schemas/resource-preset.schema";

/* =============================================================================
   초기값 정의
============================================================================= */

/** 초기 Single Node 리소스 */
export const INITIAL_SINGLE_NODE_RESOURCE: SingleNodeResource = {
  gpu: 0,
  cpu: 0,
  memory: 0,
};

/** 초기 Multi Node 리소스 */
export const INITIAL_MULTI_NODE_RESOURCE: MultiNodeResource = {
  distributedType: null,
  nodeCount: 2,
  workerGpu: 0,
  workerCpu: 0,
  workerMemory: 0,
};

/** 초기 폼 상태 */
export const INITIAL_FORM_STATE: ResourcePresetFormType = {
  name: "",
  description: "",
  jobType: "BATCH",
  nodeType: "single",
  gpuType: "NORMAL",
  selectedGpu: null,
  selectedNode: null,
  selectedProfile: null,
  singleNodeResource: INITIAL_SINGLE_NODE_RESOURCE,
  multiNodeResource: INITIAL_MULTI_NODE_RESOURCE,
};

/* =============================================================================
   State Atoms (단순 상태만)
============================================================================= */

/** 리소스 프리셋 생성 드로어 열림 상태 */
export const openCreateResourcePresetDrawerAtom = atom(false);

/** 리소스 프리셋 폼 상태 */
export const resourcePresetFormAtom =
  atom<ResourcePresetFormType>(INITIAL_FORM_STATE);

/** 리소스 프리셋 폼 에러 */
export const resourcePresetFormErrorsAtom = atom<ResourcePresetFormErrors>({});

/* =============================================================================
   Action Atoms (호환성 유지)
============================================================================= */

/**
 * Drawer 열기 + 폼 초기화
 *
 * 초기 GPU/Node 선택은 CreateResourcePresetGpuInfo 컴포넌트에서 처리
 */
export const openDrawerWithInitAtom = atom(null, (_get, set) => {
  // 1. 폼 상태를 초기값으로 리셋
  set(resourcePresetFormAtom, INITIAL_FORM_STATE);
  set(resourcePresetFormErrorsAtom, {});

  // 2. Drawer 열기
  set(openCreateResourcePresetDrawerAtom, true);
});
