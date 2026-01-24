import type { Metadata } from "next";

import { AsideNotification } from "@/domain/notification/components/detail/aside-notification";

/**
 * 관리자 알림 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "Notification Management",
};

/**
 * 관리자 알림 페이지
 *
 */
export default function AdminNotificationPage() {
  return <AsideNotification />;
}
