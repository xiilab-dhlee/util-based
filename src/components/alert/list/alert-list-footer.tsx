"use client";

import { useAtom, useAtomValue } from "jotai";

import {
  alertEndDateAtom,
  alertPageAtom,
  alertStartDateAtom,
} from "@/atoms/alert/alert-list.atom";
import alertListConstants from "@/constants/alert/alert-list.constant";
import { useGetAlerts } from "@/hooks/alert/use-get-alerts";
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
export function AlertListFooter() {
  // 현재 페이지 번호 (읽기/쓰기 가능한 Jotai atom)
  const [page, setPage] = useAtom(alertPageAtom);
  const startDate = useAtomValue(alertStartDateAtom);
  const endDate = useAtomValue(alertEndDateAtom);

  // 알림 목록 데이터 조회 (React Query 훅 사용)
  const { data, isLoading } = useGetAlerts({
    page,
    size: alertListConstants.pageSize,
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
      pageSize={alertListConstants.pageSize}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}

