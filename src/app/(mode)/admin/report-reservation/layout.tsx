"use client";

import { useSetAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import { ManageReportReservationModal } from "@/domain/report/components/modals";
import { reportReservationModalAtom } from "@/domain/report/state/report.atom";
import { DeleteReservationModal } from "@/domain/report-reservation/components/delete-reservation-modal";
import { DispatchHistoryMain } from "@/domain/report-reservation/components/dispatch-history-main";
import { ReservationListMain } from "@/domain/report-reservation/components/reservation-list-main";
import { ToggleScheduleConfirmModal } from "@/domain/report-reservation/components/toggle-schedule-confirm-modal";
import { DISPATCH_HISTORY_LIST_PAGE_SIZE } from "@/domain/report-reservation/constants/report-reservation.constant";
import { useGetDispatchHistories } from "@/domain/report-reservation/hooks/use-get-dispatch-histories";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ASIDE_WIDTH, MODAL_MODES } from "@/shared/constants/core.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
  ListSectionTitle,
} from "@/styles/layers/list-page-layers.styled";

/**
 * 리포트 예약 페이지 레이아웃
 *
 * URL에 id가 없으면 첫 번째 발송 내역으로 자동 리다이렉트합니다.
 */
export default function AdminReportReservationLayout({
  children,
}: PropsWithChildren) {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const hasRedirected = useRef(false);

  const setReservationModal = useSetAtom(reportReservationModalAtom);

  // 첫 번째 발송 내역 조회 (리다이렉트용, 캐시 공유를 위해 동일 size 사용)
  const { data: dispatchData, isLoading: isDispatchLoading } =
    useGetDispatchHistories({
      page: 1,
      size: DISPATCH_HISTORY_LIST_PAGE_SIZE,
    });

  // 첫 번째 발송 내역 ID 추출 (리다이렉트용)
  const firstDispatchId = dispatchData?.content?.[0]?.id;

  // URL에 id가 없고 데이터가 있으면 첫 번째 발송 내역으로 리다이렉트
  useEffect(() => {
    if (
      !params.id &&
      !isDispatchLoading &&
      firstDispatchId &&
      !hasRedirected.current
    ) {
      hasRedirected.current = true;
      router.replace(
        ROUTES.ADMIN_REPORT_RESERVATION_DISPATCH_DETAIL(firstDispatchId),
      );
    }
  }, [params.id, isDispatchLoading, firstDispatchId, router]);

  /**
   * 리포트 예약 생성 핸들러
   * 리포트 예약 생성 모달을 엽니다.
   */
  const handleCreateReportReservation = () => {
    setReservationModal({
      open: true,
      mode: MODAL_MODES.CREATE,
      initialData: undefined,
    });
  };
  return (
    <>
      <PageHeader
        pageKey="admin.report-reservation"
        description="Report Reservation Management"
      />
      {/* 리포트 예약 페이지 메인 영역 */}
      <ListPageMain>
        {/* 왼쪽 영역 - 예약 목록 및 발송 내역 테이블 */}
        <ListPageBody>
          {/* 리포트 예약 헤더 */}
          <ReportReservationHeader>
            <ListSectionTitle>리포트 예약</ListSectionTitle>
            <Button
              color="primary"
              icon="Plus"
              iconPosition="left"
              variant="gradient"
              width={120}
              height={30}
              onClick={handleCreateReportReservation}
            >
              리포트 예약
            </Button>
          </ReportReservationHeader>
          {/* 예약 목록 섹션 */}
          <ReservationSection>
            <ReservationListMain />
          </ReservationSection>
          {/* 발송 내역 섹션 */}
          <DispatchHistorySection>
            <DispatchHistoryMain />
          </DispatchHistorySection>
        </ListPageBody>
        {/* 오른쪽 영역 - 발송 내역 상세 정보 */}
        <ListPageAside $width={ASIDE_WIDTH}>{children}</ListPageAside>
      </ListPageMain>

      {/* 리포트 예약 관리 모달 (생성/수정) */}
      <ManageReportReservationModal />
      {/* 예약발송 토글 확인 모달 */}
      <ToggleScheduleConfirmModal />
      {/* 예약 삭제 확인 모달 */}
      <DeleteReservationModal />
    </>
  );
}

/**
 * 리포트 예약 헤더
 * 제목과 생성 버튼을 포함하는 헤더 영역
 */
const ReportReservationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

/**
 * 예약 목록 섹션
 * 상단 50% 높이
 */
const ReservationSection = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 8px;
`;

/**
 * 발송 내역 섹션
 * 하단 50% 높이
 */
const DispatchHistorySection = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
