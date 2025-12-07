import type { Metadata } from "next";

import { NotificationDetailMain } from "@/domain/notification/components/detail/notification-detail-main";

/**
 * 관리자 알림 상세 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "알림 상세",
};

/**
 * 관리자 알림 상세 페이지
 */
export default function AdminNotificationDetailPage() {
  return <NotificationDetailMain />;
}
