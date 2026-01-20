import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import type { GetAdminNotificationsNotificationTypeItem } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { AntdTableSortOrder } from "@/shared/types/core.model";

/** 알림 페이지 번호 */
export const notificationPageAtom = atomWithReset<number>(1);
/** 알림 시작 날짜 */
export const notificationStartDateAtom = atom<string>("");
/** 알림 종료 날짜 */
export const notificationEndDateAtom = atom<string>("");
/** 알림 유형 */
export const notificationTypeAtom = atom<
  GetAdminNotificationsNotificationTypeItem[] | undefined
>(undefined);
/** 알림 읽음 상태 필터 */
export const notificationHasReadAtom = atom<boolean | undefined>(undefined);

/** 알림 정렬 순서 (기본값: 내림차순) */
export const notificationSortOrderAtom = atom<AntdTableSortOrder>("descend");
