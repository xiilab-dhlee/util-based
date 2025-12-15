"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import { ReservationListBody } from "@/domain/report-reservation/components/reservation-list-body";
import { ReservationListFooter } from "@/domain/report-reservation/components/reservation-list-footer";
import { RESERVATION_LIST_PAGE_SIZE } from "@/domain/report-reservation/constants/report-reservation.constant";
import { useGetReservations } from "@/domain/report-reservation/hooks/use-get-reservations";
import { reservationPageAtom } from "@/domain/report-reservation/state/reservation.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

/**
 * 예약 목록 메인 컴포넌트
 *
 * 예약 목록 섹션에 들어갈 컴포넌트들을 렌더링합니다.
 * 필터, 테이블, 페이지네이션을 포함합니다.
 * 데이터를 한 번만 페칭하고 자식 컴포넌트에 props로 전달합니다.
 */
export function ReservationListMain() {
  const page = useAtomValue(reservationPageAtom);

  const { data, isLoading } = useGetReservations({
    page,
    size: RESERVATION_LIST_PAGE_SIZE,
  });

  const reservations = data?.content || [];
  const totalSize = data?.totalSize || 0;

  return (
    <Container>
      <MySearchFilter title="예약 목록" total={totalSize} />
      <ReservationListBody data={reservations} isLoading={isLoading} />
      <ReservationListFooter totalSize={totalSize} isLoading={isLoading} />
    </Container>
  );
}

const Container = styled.div`
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
