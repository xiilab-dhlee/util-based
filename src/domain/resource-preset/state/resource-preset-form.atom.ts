import { atom } from "jotai";

import type {
  MultiNodeResource,
  ResourcePresetFormErrors,
  ResourcePresetFormType,
  SingleNodeResource,
} from "@/domain/resource-preset/schemas/resource-preset.schema";
import type { GpuListType, GpuNodeListType } from "@/shared/schemas/gpu.schema";

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
 * Drawer 열기 + 폼 초기화 + 초기 GPU/Node/리소스 자동 선택
 *
 * 레거시 호환성을 위해 유지됨.
 * layout.tsx에서 사용 중.
 */
export const openDrawerWithInitAtom = atom(
  null,
  (
    _get,
    set,
    params: { gpuList: GpuListType[]; nodeList?: GpuNodeListType[] },
  ) => {
    const { gpuList, nodeList = [] } = params;

    // 1. 폼 상태를 초기값으로 리셋
    set(resourcePresetFormAtom, INITIAL_FORM_STATE);
    set(resourcePresetFormErrorsAtom, {});

    // 2. Drawer 열기
    set(openCreateResourcePresetDrawerAtom, true);

    // 3. 초기 gpuType의 첫 번째 GPU 자동 선택
    const gpusByType = gpuList.filter(
      (gpu) => gpu.type === INITIAL_FORM_STATE.gpuType,
    );
    const firstGpu = gpusByType[0] ?? null;

    if (!firstGpu) {
      return;
    }

    // 4. 선택된 GPU의 첫 번째 노드 자동 선택
    const matchedNode =
      nodeList.find((node) => node.gpuId === firstGpu.id) ?? null;

    // 5. 노드 정보를 바탕으로 리소스 초기화
    const initialResource = matchedNode
      ? {
          gpu: matchedNode.gpuTotal,
          cpu: matchedNode.cpuTotal,
          memory: matchedNode.memoryTotal,
        }
      : INITIAL_SINGLE_NODE_RESOURCE;

    set(resourcePresetFormAtom, {
      ...INITIAL_FORM_STATE,
      selectedGpu: firstGpu,
      selectedNode: matchedNode,
      singleNodeResource: initialResource,
    });
  },
);
