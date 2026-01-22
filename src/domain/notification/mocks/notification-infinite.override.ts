import { delay, HttpResponse, http } from "msw";

import type {
  AdminNotificationItemResponse,
  NotificationItemResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/**
 * 무한 스크롤 테스트용 알림 목록 핸들러
 * - 총 24개 알림 (3페이지)
 * - 페이지당 8개
 */

const TOTAL_NOTIFICATIONS = 24;
const PAGE_SIZE = 8;
const TOTAL_PAGES = Math.ceil(TOTAL_NOTIFICATIONS / PAGE_SIZE);

function generateNotifications(
  pageNo: number,
  pageSize: number,
): NotificationItemResponse[] {
  const startIndex = pageNo * pageSize;
  const endIndex = Math.min(startIndex + pageSize, TOTAL_NOTIFICATIONS);

  return Array.from({ length: endIndex - startIndex }, (_, i) => ({
    notificationId: startIndex + i + 1,
    notificationContent: `테스트 알림 ${startIndex + i + 1}번 - 무한 스크롤 테스트용 알림 메시지입니다.`,
    notificationType: "WORKSPACE" as const,
    createdAt: new Date(Date.now() - (startIndex + i) * 3600000).toISOString(),
    isRead: i % 3 === 0,
  }));
}

export const notificationInfiniteOverrideHandlers = [
  // User notifications
  http.get(
    "*/api/v1/accounts/:accountId/notifications",
    async ({ request }) => {
      await delay(500);

      const url = new URL(request.url);
      const pageNo = parseInt(url.searchParams.get("pageNo") ?? "0", 10);
      const pageSize = parseInt(
        url.searchParams.get("pageSize") ?? String(PAGE_SIZE),
        10,
      );

      const content = generateNotifications(pageNo, pageSize);

      return HttpResponse.json(
        {
          status: "SUCCESS",
          message: "알림 목록 조회 성공",
          data: {
            totalSize: TOTAL_NOTIFICATIONS,
            totalPageNum: TOTAL_PAGES,
            currentPageNo: pageNo,
            content,
          },
          timestamp: Date.now(),
        },
        { status: 200 },
      );
    },
  ),

  // Admin notifications
  http.get(
    "*/api/v1/admin/accounts/:accountId/notifications",
    async ({ request }) => {
      await delay(500);

      const url = new URL(request.url);
      const pageNo = parseInt(url.searchParams.get("pageNo") ?? "0", 10);
      const pageSize = parseInt(
        url.searchParams.get("pageSize") ?? String(PAGE_SIZE),
        10,
      );

      const content: AdminNotificationItemResponse[] = generateNotifications(
        pageNo,
        pageSize,
      ).map((item) => ({
        ...item,
        notificationSetName: "LICENSE_EXPIRATION",
      }));

      return HttpResponse.json(
        {
          status: "SUCCESS",
          message: "관리자 알림 목록 조회 성공",
          data: {
            totalSize: TOTAL_NOTIFICATIONS,
            totalPageNum: TOTAL_PAGES,
            currentPageNo: pageNo,
            content,
          },
          timestamp: Date.now(),
        },
        { status: 200 },
      );
    },
  ),
];
