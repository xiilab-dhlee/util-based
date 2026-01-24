import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import {
  MONITORING_NOTIFICATION_HISTORY_DEFAULT_SORT,
  MONITORING_NOTIFICATION_SETTING_DEFAULT_SORT,
  type MonitoringNotificationHistorySortState,
  type MonitoringNotificationSettingSortState,
} from "@/domain/monitoring-notification/constants/monitoring-notification.constant";

/** 날짜 범위 상태 타입 */
export type DateRangeState = { start: Date; end: Date } | null;

/** 모니터링 알림 히스토리 페이지 번호 */
export const monitoringNotificationPageAtom = atomWithReset<number>(1);
/** 모니터링 알림 설정 페이지 번호 */
export const monitoringNotificationSettingPageAtom = atomWithReset<number>(1);
/** 모니터링 알림 검색어 */
export const monitoringNotificationSearchTextAtom = atomWithReset<string>("");
/** 모니터링 알림 히스토리 정렬 상태 */
export const monitoringNotificationHistorySortAtom =
  atomWithReset<MonitoringNotificationHistorySortState>(
    MONITORING_NOTIFICATION_HISTORY_DEFAULT_SORT,
  );
/** 모니터링 알림 히스토리 날짜 범위 필터 */
export const monitoringNotificationHistoryDateRangeAtom =
  atomWithReset<DateRangeState>(null);
/** 모니터링 알림 설정 정렬 상태 */
export const monitoringNotificationSettingSortAtom =
  atomWithReset<MonitoringNotificationSettingSortState>(
    MONITORING_NOTIFICATION_SETTING_DEFAULT_SORT,
  );
/** 모니터링 알림 설정 모달 표시 여부 */
export const openManageMonitoringNotificationModalAtom = atom<boolean>(false);
/** 모니터링 알림 설정 상세 모달 표시 여부 */
export const openViewMonitoringNotificationModalAtom = atom<boolean>(false);
/** 모니터링 알림 내역 상세 모달 표시 여부 */
export const openViewMonitoringNotificationHistoryModalAtom =
  atom<boolean>(false);
/** 모니터링 알림 설정 삭제 모달 표시 여부 */
export const openDeleteMonitoringNotificationModalAtom = atom<boolean>(false);
