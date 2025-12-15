"use client";

import { ViewReportReservationModal } from "@/domain/report-reservation/components/view-report-reservation-modal";
import type { ReservationListType } from "@/domain/report-reservation/schemas/report-reservation.schema";
import { createReservationColumn } from "@/shared/components/column/create-reservation-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { RESERVATION_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface ReservationListBodyProps {
  /** 예약 목록 데이터 */
  data: ReservationListType[];
  /** 로딩 상태 */
  isLoading: boolean;
}

/**
 * 예약 목록 페이지 본문 컴포넌트
 *
 * 예약 목록 페이지에서 예약 목록을 표시하는 테이블을 제공합니다.
 *
 * @param props - 컴포넌트 props
 * @param props.data - 예약 목록 데이터
 * @param props.isLoading - 로딩 상태
 * @returns 예약 목록 페이지 본문 컴포넌트
 */
export function ReservationListBody({
  data,
  isLoading,
}: ReservationListBodyProps) {
  const publish = usePublish();

  /** 리포트 이름 클릭 시 상세 모달 열기 */
  const handleReportNameClick = (id: string) => {
    publish(RESERVATION_EVENTS.openReservationDetailModal, { id });
  };

  return (
    <>
      <ListWrapper>
        <CustomizedTable
          columns={createReservationColumn({
            onReportNameClick: handleReportNameClick,
          })}
          data={data}
          columnHeight={40}
          activePadding
          loading={isLoading}
        />
      </ListWrapper>

      <ViewReportReservationModal />
    </>
  );
}
