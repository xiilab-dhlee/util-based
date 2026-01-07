export const HUB_PAGE_SIZE = 12;
export const HUB_CARD_HEIGHT = 151;

/**
 * 허용되는 허브 모델 타입 목록
 * API 스키마의 modelType은 string이지만, 실제 허용 값은 제한됨
 * 새로운 모델 타입 추가 시 이 목록 업데이트 필요
 */
export const VALID_MODEL_TYPES = ["Object Detection"] as const;
