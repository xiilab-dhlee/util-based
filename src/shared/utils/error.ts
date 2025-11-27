// 🎯 모든 도메인의 에러 설정을 중앙에서 통합 관리

import { monitoringNotificationErrorConfig } from "@/domain/monitoring-notification/constants/monitoring-notification.error";
import type { ErrorConfig } from "@/shared/types/error";

// 🚀 전역 에러 설정 레지스트리 (도메인 설정 병합)
const errorConfigRegistry: Record<string, ErrorConfig> = {
  ...monitoringNotificationErrorConfig,
  // ...workspaceErrorConfig,
};

// 기본 에러 설정
const defaultErrorConfig: ErrorConfig = {
  showToast: true,
  errorMessage: "요청 처리 중 오류가 발생했습니다.",
  statusMessages: {
    401: "로그인이 필요합니다.",
    403: "접근 권한이 없습니다.",
    404: "요청한 데이터를 찾을 수 없습니다.",
    500: "서버에 문제가 발생했습니다.",
    0: "네트워크 연결을 확인해주세요.",
  },
};

// 🎯 모든 에러 설정 조회 (lazy loading)
export const getAllErrorConfigs = (): Record<string, ErrorConfig> => {
  return {
    ...errorConfigRegistry,
    default: defaultErrorConfig,
  };
};

export type { ErrorConfig };
