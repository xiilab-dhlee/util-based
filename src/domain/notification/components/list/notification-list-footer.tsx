"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";

import { useGetNotifications } from "@/domain/notification/hooks/use-get-notifications";
import {
  notificationCheckedListAtom,
  notificationEndDateAtom,
  notificationPageAtom,
  notificationStartDateAtom,
} from "@/domain/notification/state/notification.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

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
  // 체크된 알림 목록
  const selectedNotifications = useAtomValue(notificationCheckedListAtom);
  const resetCheckedList = useResetAtom(notificationCheckedListAtom);

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
    resetCheckedList();
    setPage(page);
  };

  /**
   * 삭제 버튼 클릭 핸들러
   */
  const handleClickDelete = () => {
    // TODO: 삭제 모달 연결
  };

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
      rightChildren={
        <ListDeleteButton
          onClick={handleClickDelete}
          disabled={selectedNotifications.size === 0}
        />
      }
    />
  );
}
