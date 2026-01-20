"use client";

import { useAtom } from "jotai";

import { notificationPageAtom } from "@/domain/notification/state/notification.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface NotificationListFooterProps {
  /** 알림 총 개수 */
  total: number;
  /** 로딩 상태 */
  isLoading: boolean;
}

/**
 * 알림 목록 페이지 하단 푸터 컴포넌트
 *
 * 알림 목록 페이지에서 페이지네이션을 제공하는 푸터 컴포넌트입니다.
 * 현재 페이지 번호, 총 알림 수, 페이지 크기를 표시하고,
 * 페이지 변경 시 상태를 업데이트합니다.
 *
 * @param total - 알림 총 개수
 * @param isLoading - 로딩 상태
 * @returns 알림 목록 페이지 하단 푸터 컴포넌트
 */
export function NotificationListFooter({
  total,
  isLoading,
}: NotificationListFooterProps) {
  const [page, setPage] = useAtom(notificationPageAtom);

  /**
   * 페이지 변경 핸들러
   * @param page - 변경할 페이지 번호
   */
  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
