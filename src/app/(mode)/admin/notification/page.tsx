import type { Metadata } from "next";

import { NotificationListMain } from "@/components/notification/list/notification-list-main";

/**
 * 관리자 알림 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "알림 관리 | AstraGo",
};

/**
 * 관리자 알림 페이지
 *
 */
export default function AdminNotificationPage() {
  return <NotificationListMain />;
}
