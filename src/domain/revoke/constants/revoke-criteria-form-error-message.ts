import { REVOKE_CRITERIA_LIMITS } from "@/domain/revoke/constants/revoke-criteria.constant";

const { METRICS, OPERATING_HOUR, WARNING_COUNT } = REVOKE_CRITERIA_LIMITS;

/**
 * 리소스 회수 기준 폼 에러 메시지 상수
 * - Zod 에러맵에서 사용
 */
export const REVOKE_CRITERIA_FORM_ERROR_MESSAGES = {
  operatingHour: {
    required: "검사 주기를 입력해주세요.",
    too_small: `검사 주기는 ${OPERATING_HOUR.MIN}시간 이상이어야 합니다.`,
    too_big: `검사 주기는 ${OPERATING_HOUR.MAX}시간 이하이어야 합니다.`,
  },
  metrics: {
    atLeastOne: "GPU, CPU, Memory 중 최소 1개의 값을 입력해주세요.",
    gpu: {
      too_small: `GPU 임계값은 ${METRICS.MIN}% 이상이어야 합니다.`,
      too_big: `GPU 임계값은 ${METRICS.MAX}% 이하이어야 합니다.`,
    },
    cpu: {
      too_small: `CPU 임계값은 ${METRICS.MIN}% 이상이어야 합니다.`,
      too_big: `CPU 임계값은 ${METRICS.MAX}% 이하이어야 합니다.`,
    },
    mem: {
      too_small: `Memory 임계값은 ${METRICS.MIN}% 이상이어야 합니다.`,
      too_big: `Memory 임계값은 ${METRICS.MAX}% 이하이어야 합니다.`,
    },
  },
  reclaimWarningCount: {
    required: "경고 횟수를 입력해주세요.",
    too_small: `경고 횟수는 ${WARNING_COUNT.MIN}회 이상이어야 합니다.`,
  },
} as const;
