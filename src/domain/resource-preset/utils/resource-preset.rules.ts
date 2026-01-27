import {
  GetPresetsNodeType,
  GetPresetsWorkloadJobType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/* =============================================================================
   리소스 프리셋 비즈니스 룰 함수
   
   조건부 렌더링 및 비즈니스 로직을 순수 함수로 분리하여
   가독성, 재사용성, 테스트 용이성을 확보합니다.
============================================================================= */

/**
 * Multi Node 활성화 여부
 * - Interactive Job에서는 Multi Node 사용 불가
 */
export const isMultiNodeEnabled = (
  jobType: GetPresetsWorkloadJobType,
): boolean => jobType !== GetPresetsWorkloadJobType.INTERACTIVE;

/**
 * Single Node 여부 체크 (내부 헬퍼)
 * - 다른 UI 표시 함수들의 기반이 되는 기본 조건
 */
export const isSingleNode = (nodeType: GetPresetsNodeType): boolean =>
  nodeType === GetPresetsNodeType.SINGLE;

/**
 * 싱글노드 리소스 섹션 표시 여부
 * - Single Node에서만 기본 리소스 슬라이더 표시
 * - showGpuNodeDropdown과 동일한 조건이지만 의미론적으로 다른 용도
 */
export const showSingleNodeResource = (nodeType: GetPresetsNodeType): boolean =>
  isSingleNode(nodeType);

/**
 * Batch + Multi 조합에서 Normal GPU만 허용 여부
 */
export const isNormalGpuOnlyInBatchMulti = (
  jobType: GetPresetsWorkloadJobType,
  nodeType: GetPresetsNodeType,
): boolean =>
  jobType === GetPresetsWorkloadJobType.BATCH &&
  nodeType === GetPresetsNodeType.MULTI;
