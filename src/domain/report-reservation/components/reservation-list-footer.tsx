"use client";

import { useAtom } from "jotai";

import { RESERVATION_LIST_PAGE_SIZE } from "@/domain/report-reservation/constants/report-reservation.constant";
import { reservationPageAtom } from "@/domain/report-reservation/state/reservation.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface ReservationListFooterProps {
  /** 전체 예약 수 */
  totalSize: number;
  /** 로딩 상태 */
  isLoading: boolean;
}

/**
 * 예약 목록 페이지 하단 푸터 컴포넌트
 *
 * 예약 목록 페이지에서 페이지 번호를 관리하고,
 * 총 예약 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @param props - 컴포넌트 props
 * @param props.totalSize - 전체 예약 수
 * @param props.isLoading - 로딩 상태
 * @returns 예약 목록 페이지 하단 푸터 컴포넌트
 */
export function ReservationListFooter({
  totalSize,
  isLoading,
}: ReservationListFooterProps) {
  const [page, setPage] = useAtom(reservationPageAtom);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={RESERVATION_LIST_PAGE_SIZE}
      onChange={handlePageChange}
      isLoading={isLoading}
    />
  );
}
