import type { ErrorConfig } from "@/shared/types/error";

/**
 * 모니터링 알림 도메인 에러 설정
 */
export const monitoringNotificationErrorConfig: Record<string, ErrorConfig> = {
  // GET 요청 (조회) - 토스트 표시 안함
  "monitoring-notification.notificationList": {
    showToast: false,
    errorMessage: "알림 설정 목록을 불러올 수 없습니다.",
  },
  "monitoring-notification.notificationSettingList": {
    showToast: false,
    errorMessage: "알림 설정 목록을 불러올 수 없습니다.",
  },
  "monitoring-notification.notificationSettingDetail": {
    showToast: false,
    errorMessage: "알림 설정 상세 정보를 불러올 수 없습니다.",
  },
  // Mutation 요청 (생성/수정) - 토스트 표시
  "monitoring-notification.create": {
    showToast: true,
    errorMessage: "알림 설정 생성에 실패했습니다.",
  },
  "monitoring-notification.update": {
    showToast: true,
    errorMessage: "알림 설정 수정에 실패했습니다.",
  },
  "monitoring-notification.upsert": {
    showToast: true,
    errorMessage: "알림 설정에 실패했습니다.",
  },
};
