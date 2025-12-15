import type {
  ResourcePresetGpuType,
  ResourcePresetJobType,
  ResourcePresetNodeType,
} from "../schemas/resource-preset.schema";

/* =============================================================================
   리소스 프리셋 비즈니스 룰 함수
   
   조건부 렌더링 및 비즈니스 로직을 순수 함수로 분리하여
   가독성, 재사용성, 테스트 용이성을 확보합니다.
============================================================================= */

/**
 * Multi Node 활성화 여부
 * - Interactive Job에서는 Multi Node 사용 불가
 */
export const isMultiNodeEnabled = (jobType: ResourcePresetJobType): boolean =>
  jobType !== "INTERACTIVE";

/**
 * Single Node 여부 체크 (내부 헬퍼)
 * - 다른 UI 표시 함수들의 기반이 되는 기본 조건
 */
const isSingleNode = (nodeType: ResourcePresetNodeType): boolean =>
  nodeType === "single";

/**
 * GPU 사용 노드 드롭다운 표시 여부
 * - Single Node에서만 GPU 노드 선택 드롭다운 표시
 */
export const showGpuNodeDropdown = (
  nodeType: ResourcePresetNodeType,
): boolean => isSingleNode(nodeType);

/**
 * GPU 개수 고정 여부
 * - MIG 타입일 때 GPU 개수 1개로 고정
 */
export const isGpuCountFixed = (gpuType: ResourcePresetGpuType): boolean =>
  gpuType === "MIG";

/**
 * 고정된 GPU 개수 반환
 * - MIG일 때 1개, 그 외에는 null (고정 아님)
 */
export const getFixedGpuCount = (
  gpuType: ResourcePresetGpuType,
): number | null => (gpuType === "MIG" ? 1 : null);

/**
 * 분산 학습 섹션 표시 여부
 * - Multi Node에서만 분산 학습 UI 표시
 */
export const showDistributedSection = (
  nodeType: ResourcePresetNodeType,
): boolean => nodeType === "multi";

/**
 * 싱글노드 리소스 섹션 표시 여부
 * - Single Node에서만 기본 리소스 슬라이더 표시
 * - showGpuNodeDropdown과 동일한 조건이지만 의미론적으로 다른 용도
 */
export const showSingleNodeResource = (
  nodeType: ResourcePresetNodeType,
): boolean => isSingleNode(nodeType);
