"use client";

import { useSetAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { Icon, Modal, Typography } from "xiilab-ui";

import { REPORT_TYPE_LABEL } from "@/domain/report/constants/report.constant";
import { reportReservationModalAtom } from "@/domain/report/state/report.atom";
import { useGetReservationDetail } from "@/domain/report-reservation/hooks/use-get-reservation-detail";
import type { ReservationDetailType } from "@/domain/report-reservation/schemas/report-reservation.schema";
import { formatDispatchSchedule } from "@/domain/report-reservation/utils/report-reservation.util";
import { createMemberColumn } from "@/shared/components/column/create-member-column";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { MODAL_MODES } from "@/shared/constants/core.constant";
import { RESERVATION_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { formatDateTimeSafely } from "@/shared/utils/date.util";

// ===== 타입 =====

export interface ViewReportReservationModalPayload {
  id: string;
}

// ===== 컴포넌트 =====

/**
 * 리포트 예약 상세 모달
 *
 * PubSub 패턴을 사용하여 모달을 열고 ID를 전달받습니다.
 * 모달 내부에서 API를 호출하여 데이터를 가져옵니다.
 * 수정 버튼 클릭 시 수정 모달을 엽니다.
 */
export function ViewReportReservationModal() {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const setReservationModal = useSetAtom(reportReservationModalAtom);

  // PubSub 구독 - 리포트 예약 상세 모달 열기 이벤트
  useSubscribe<ViewReportReservationModalPayload>(
    RESERVATION_EVENTS.openReservationDetailModal,
    useCallback((payload) => {
      setId(payload.id);
      setOpen(true);
    }, []),
  );

  const handleCancel = () => {
    setOpen(false);
    setId(null);
  };

  const handleEdit = (detail: ReservationDetailType) => {
    // 상세 모달 닫고 수정 모달 열기
    setOpen(false);
    setId(null);
    setReservationModal({
      open: true,
      mode: MODAL_MODES.UPDATE,
      initialData: detail,
    });
  };

  if (!open || id === null) return null;

  return (
    <ViewReportReservationModalContent
      id={id}
      open={open}
      onCancel={handleCancel}
      onEdit={handleEdit}
    />
  );
}

interface ViewReportReservationModalContentProps {
  id: string;
  open: boolean;
  onCancel: () => void;
  onEdit: (detail: ReservationDetailType) => void;
}

function ViewReportReservationModalContent({
  id,
  open,
  onCancel,
  onEdit,
}: ViewReportReservationModalContentProps) {
  // 예약 상세 데이터 조회
  const { data, isLoading, isError, refetch } = useGetReservationDetail(id);

  const handleEdit = () => {
    if (!data) return;
    onEdit(data);
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="ReportReservation" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="리포트 예약 상세"
      showCancelButton
      cancelText="취소"
      onCancel={onCancel}
      okText="수정"
      onOk={handleEdit}
      okButtonProps={{ disabled: isLoading || isError || !data }}
      cancelButtonProps={{ disabled: isLoading }}
      centered
      showHeaderBorder
      loading={isLoading}
    >
      {isError && (
        <DataErrorState
          title="예약 정보를 불러올 수 없습니다."
          onRetry={refetch}
        />
      )}

      {data && (
        <>
          <ContentBox>
            <InfoRow>
              <Label>리포트 이름</Label>
              <Value>{data.reportName}</Value>
            </InfoRow>
            <InfoRow>
              <Label>리포트 종류</Label>
              <Value>{REPORT_TYPE_LABEL[data.reportType] ?? "-"}</Value>
            </InfoRow>
            <InfoRow>
              <Label>발송 주기</Label>
              <Value>
                {formatDispatchSchedule(data.dispatchCycle, data.dispatchDay)}
              </Value>
            </InfoRow>
            <InfoRow>
              <Label>시작일시</Label>
              <Value>{formatDateTimeSafely(data.startDateTime)}</Value>
            </InfoRow>
            <InfoRow>
              <Label>종료일시</Label>
              <Value>{formatDateTimeSafely(data.endDateTime)}</Value>
            </InfoRow>
            <InfoRow>
              <Label>예약 발송</Label>
              <Value>{data.isScheduled ? "사용" : "미사용"}</Value>
            </InfoRow>
          </ContentBox>

          <RecipientSection>
            <RecipientLabel>수신자</RecipientLabel>
            <RecipientTableWrapper>
              <ReservationRecipientTable recipients={data.recipients} />
            </RecipientTableWrapper>
          </RecipientSection>
        </>
      )}
    </Modal>
  );
}

// ===== 수신자 테이블 컴포넌트 =====

interface ReservationRecipientTableProps {
  recipients: ReservationDetailType["recipients"];
}

function ReservationRecipientTable({
  recipients,
}: ReservationRecipientTableProps) {
  // 삭제 버튼 없는 컬럼 생성
  const columns = useMemo(() => createMemberColumn(), []);

  return (
    <CustomizedTable
      columns={columns}
      data={recipients}
      pagination={false}
      activePadding
      rowKey="id"
    />
  );
}

// ===== Styled Components =====

const ContentBox = styled.div`
  background-color: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  padding: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  & + & {
    margin-top: 12px;
  }
`;

const Label = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  min-width: 70px;
  color: #484848;
  font-weight: 600;
`;

const Value = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  color: #000;
  flex: 1;
  word-break: break-all;
  white-space: normal;
`;

const RecipientSection = styled.div`
  margin-top: 16px;
`;

const RecipientLabel = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
`;

const RecipientTableWrapper = styled.div`
  max-height: 150px;
  overflow-y: auto;
`;
