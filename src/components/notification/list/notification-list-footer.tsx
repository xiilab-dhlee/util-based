"use client";

import { useAtom, useAtomValue } from "jotai";

import {
  notificationEndDateAtom,
  notificationPageAtom,
  notificationStartDateAtom,
} from "@/atoms/notification.atom";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetNotifications } from "@/hooks/notification/use-get-notifications";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

/**
 * 알림 목록 페이지 하단 푸터 컴포넌트
 *
 * 알림 목록 페이지에서 페이지네이션을 제공하는 푸터 컴포넌트입니다.
 * 현재 페이지 번호, 총 알림 수, 페이지 크기를 표시하고,
 * 페이지 변경 시 상태를 업데이트합니다.
 *
 * @returns 알림 목록 페이지 하단 푸터 컴포넌트
 */
export function NotificationListFooter() {
  // 현재 페이지 번호 (읽기/쓰기 가능한 Jotai atom)
  const [page, setPage] = useAtom(notificationPageAtom);
  const startDate = useAtomValue(notificationStartDateAtom);
  const endDate = useAtomValue(notificationEndDateAtom);

  // 알림 목록 데이터 조회 (React Query 훅 사용)
  const { data, isLoading } = useGetNotifications({
    page,
    size: LIST_PAGE_SIZE,
    startDate,
    endDate,
  });

  /**
   * 페이지 변경 핸들러
   * @param page - 변경할 페이지 번호
   */
  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
