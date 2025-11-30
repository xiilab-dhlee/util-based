import type {
  MonitoringNotificationListResponseType,
  MonitoringNotificationRequestPayload,
} from "@/domain/monitoring-notification/schemas/monitoring-notification.schema";
import type { MODAL_MODES, ModalMode } from "@/shared/constants/core.constant";
import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

// ===== 모달 관련 타입 =====

/**
 * 모니터링 알림 모달 열기 이벤트 payload
 */
export type OpenNotificationModalPayload =
  | { mode: (typeof MODAL_MODES)["CREATE"] }
  | {
      mode: (typeof MODAL_MODES)["UPDATE"];
      data: MonitoringNotificationListResponseType;
    };

/**
 * 모니터링 알림 모달 모드
 */
export type NotificationModalMode = ModalMode;

/**
 * 모니터링 알림 목록 조회 payload
 */
export interface GetMonitoringNotificationsPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}

/**
 * 모니터링 알림 생성 payload
 */
export type CreateMonitoringNotificationPayload =
  MonitoringNotificationRequestPayload;

/**
 * 모니터링 알림 수정 payload
 */
export interface UpdateMonitoringNotificationPayload
  extends MonitoringNotificationRequestPayload {
  id: string;
}

/**
 * 폼 검증 에러 타입
 * - Zod 에러를 필드별로 매핑한 구조
 */
export interface MonitoringNotificationFormErrors {
  /** 알림 이름 에러 */
  name?: string;
  /** 노드 선택 에러 */
  nodeName?: string;
  /** 채널 선택 에러 (isEmail || isSystem refine 에러) */
  channel?: string;
  /** settings 배열 전체 에러 (min 1개 등) */
  settings?: string;
  /** settings 개별 항목 에러 */
  settingsItems?: Array<{
    item?: string;
    operator?: string;
    threshold?: string;
    duration?: string;
  }>;
}
