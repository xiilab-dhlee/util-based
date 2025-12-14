"use client";

import { useAtom } from "jotai";
import { type ComponentProps, type ComponentType, useEffect } from "react";
import styled from "styled-components";
import {
  DatePicker,
  Dropdown,
  Form,
  FormItem,
  Icon,
  Input,
  InputNumber,
  Modal,
  Radio,
  TextArea,
  Typography,
} from "xiilab-ui";

import type { ConfirmReportReservationMemberSelectionPayload } from "@/domain/report/components/modals/report-reservation-member-modal";
import { ReportReservationMemberModal } from "@/domain/report/components/modals/report-reservation-member-modal";
import { ReportReservationRecipientTable } from "@/domain/report/components/modals/report-reservation-recipient-table";
import { REPORT_TYPE_OPTIONS } from "@/domain/report/constants/report.constant";
import { useReportReservationForm } from "@/domain/report/hooks/use-report-reservation-form";
import { reportReservationModalAtom } from "@/domain/report/state/report.atom";
import {
  REPORT_RESERVATION_PERIOD_UNIT_DAY,
  REPORT_RESERVATION_PERIOD_UNIT_WEEK,
  REPORT_RESERVATION_PERIOD_UNITS,
  REPORT_RESERVATION_USAGE_ENABLED,
  REPORT_RESERVATION_USAGE_OPTIONS,
  REPORT_RESERVATION_WEEK_DAYS,
  type ReportReservationPeriodUnit,
  type ReportReservationWeekDayKey,
} from "@/domain/report-reservation/constants/report-reservation.constant";
import { CreateModelButton } from "@/shared/components/button/create-model-button";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { MODAL_MODES } from "@/shared/constants/core.constant";
import { RESERVATION_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import { GROUP_TREE_NODE_TYPE } from "@/shared/schemas/group-tree.schema";

/**
 * 리포트 예약 관리 모달 (생성/수정)
 *
 * @description
 * - 리포트 이름, 설명, 종류, 발송 주기, 수신자 등을 입력받는 폼 제공
 * - 멤버 추가 시 별도 모달(ReportReservationMemberModal) 호출
 * - mode에 따라 생성/수정 동작 분기
 */
export function ManageReportReservationModal() {
  const [modalState, setModalState] = useAtom(reportReservationModalAtom);
  const publish = usePublish();

  const { open, mode, initialData } = modalState;
  const isUpdateMode = mode === MODAL_MODES.UPDATE;

  const form = useReportReservationForm();

  const isDayUnit =
    form.formState.periodUnit === REPORT_RESERVATION_PERIOD_UNIT_DAY;
  const isWeekUnit =
    form.formState.periodUnit === REPORT_RESERVATION_PERIOD_UNIT_WEEK;

  // 수정 모드일 때 초기 데이터로 폼 설정
  useEffect(() => {
    if (open && isUpdateMode && initialData) {
      form.initializeFromDetail(initialData);
    }
  }, [open, isUpdateMode, initialData, form.initializeFromDetail]);

  // PubSub 구독 - 멤버 선택 확인
  useSubscribe<ConfirmReportReservationMemberSelectionPayload>(
    RESERVATION_EVENTS.confirmMemberSelection,
    (payload) => {
      form.setRecipients(payload.members);
    },
  );

  // 모달 닫기
  const handleClose = () => {
    form.reset();
    setModalState({
      open: false,
      mode: MODAL_MODES.CREATE,
      initialData: undefined,
    });
  };

  // 폼 제출
  const handleSubmit = () => {
    const payload = form.validate();
    if (!payload) return;

    // TODO: API 호출 (mode에 따라 생성/수정 API 분기)
    if (isUpdateMode) {
      console.log("Update:", payload);
    } else {
      console.log("Create:", payload);
    }
    handleClose();
  };

  // 모달 타이틀
  const modalTitle = isUpdateMode ? "리포트 예약 수정" : "리포트 예약";
  // 확인 버튼 텍스트
  const okButtonText = isUpdateMode ? "수정" : "추가";
  // 아이콘
  const modalIcon = isUpdateMode ? (
    <Icon name="Edit02" color="#fff" size={18} />
  ) : (
    <Icon name="Plus" color="#fff" size={18} />
  );

  // 멤버 추가 버튼 클릭
  const handleAddMember = () => {
    publish(RESERVATION_EVENTS.openMemberModal, {
      selectedAccounts: form.recipientTableData.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        type: GROUP_TREE_NODE_TYPE.account,
      })),
    });
  };

  return (
    <>
      <Modal
        type="primary"
        icon={modalIcon}
        modalWidth={700}
        styles={{
          body: {
            maxHeight: 650,
            overflowY: "auto",
          },
        }}
        open={open}
        closable
        title={modalTitle}
        showCancelButton
        cancelText="취소"
        onCancel={handleClose}
        okText={okButtonText}
        onOk={handleSubmit}
        centered
        showHeaderBorder
      >
        <TwoColumnLayout>
          {/* 왼쪽 컬럼 - 폼 필드들 */}
          <LeftColumn>
            <Form layout="vertical">
              {/* 이름 */}
              <FormItem label="이름" required>
                <Input
                  type="text"
                  placeholder="리포트 이름을 입력해 주세요."
                  width="100%"
                  value={form.formState.name}
                  onChange={(e) => form.setField("name", e.target.value)}
                  status={form.errors.name ? "error" : undefined}
                />
              </FormItem>

              {/* 설명 */}
              <FormItem label="설명">
                <TextArea
                  placeholder="설명을 입력해 주세요."
                  value={form.formState.description}
                  height="60px"
                  onChange={(e) => form.setField("description", e.target.value)}
                />
              </FormItem>

              {/* 리포트 종류 */}
              <FormItem label="리포트 종류" required>
                <Dropdown
                  options={REPORT_TYPE_OPTIONS}
                  value={form.formState.reportType || undefined}
                  onChange={(value) => form.setField("reportType", value || "")}
                  width="100%"
                  height={30}
                  placeholder="리포트 종류를 선택해 주세요."
                  status={form.errors.reportType ? "error" : "default"}
                />
              </FormItem>

              {/* 발송 시작일시 */}
              <FormItem label="발송 시작일시" required>
                <StyledDatePicker
                  selected={new Date(form.formState.startDateTime)}
                  onChange={(date) => {
                    if (!date) return;
                    form.setField("startDateTime", date.toISOString());
                  }}
                  placeholder="시작일시를 선택해 주세요."
                  width="100%"
                  height={30}
                  withTime
                  disablePastTime
                />
              </FormItem>

              {/* 발송 주기 */}
              <FormItem label="">
                <LabelRow>
                  <Typography.Text variant="body-2-2">
                    발송 주기<RequiredMark> *</RequiredMark>
                  </Typography.Text>
                  <GuideTooltip
                    placement="bottom"
                    title={
                      <>
                        일, 개월 단위의 경우 설정한 시간을
                        <br />
                        기준으로 발송일이 결정됩니다.
                      </>
                    }
                  />
                </LabelRow>
                <PeriodRow>
                  <PeriodValue>
                    <InputNumber
                      width="100%"
                      height={30}
                      min={1}
                      max={isDayUnit ? 31 : undefined}
                      controls={true}
                      value={form.formState.periodValue}
                      onChange={(value) =>
                        form.setField("periodValue", (value ?? 1) as number)
                      }
                      status={form.errors.periodValue ? "error" : "default"}
                    />
                  </PeriodValue>
                  <PeriodUnit>
                    <Dropdown
                      options={REPORT_RESERVATION_PERIOD_UNITS.map((unit) => ({
                        label: unit.label,
                        value: unit.key,
                      }))}
                      value={form.formState.periodUnit}
                      width="100%"
                      height={30}
                      onChange={(value) => {
                        form.setField(
                          "periodUnit",
                          (value ??
                            REPORT_RESERVATION_PERIOD_UNIT_DAY) as ReportReservationPeriodUnit,
                        );
                      }}
                      status={form.errors.periodUnit ? "error" : "default"}
                    />
                  </PeriodUnit>
                </PeriodRow>
              </FormItem>

              {/* 발송 요일 (주 단위일 때만 표시) */}
              {isWeekUnit && (
                <FormItem label="발송 요일" required>
                  <WeekDaysRow>
                    {REPORT_RESERVATION_WEEK_DAYS.map((day) => (
                      <WeekDayItem key={day.key}>
                        <Radio
                          value={day.key}
                          label={day.label}
                          checked={form.formState.weekDays.includes(day.key)}
                          onClick={() =>
                            form.setField("weekDays", [
                              day.key as ReportReservationWeekDayKey,
                            ])
                          }
                          size="small"
                        />
                      </WeekDayItem>
                    ))}
                  </WeekDaysRow>
                </FormItem>
              )}

              {/* 종료 날짜 지정 */}
              <FormItem label="종료 날짜 지정" required>
                <RadioRow>
                  {REPORT_RESERVATION_USAGE_OPTIONS.map((option) => (
                    <RadioItem key={option.key}>
                      <Radio
                        value={option.key}
                        label={option.label}
                        checked={form.formState.endDateUsage === option.key}
                        onClick={() =>
                          form.setField("endDateUsage", option.key)
                        }
                        size="small"
                      />
                    </RadioItem>
                  ))}
                </RadioRow>
              </FormItem>

              {/* 종료 날짜 (사용일 때만 표시) */}
              {form.formState.endDateUsage ===
                REPORT_RESERVATION_USAGE_ENABLED && (
                <FormItem label="종료 날짜" required>
                  <StyledDatePicker
                    selected={
                      form.formState.endDateTime
                        ? new Date(form.formState.endDateTime)
                        : null
                    }
                    onChange={(date) => {
                      form.setField("endDateTime", date?.toISOString() ?? null);
                    }}
                    placeholder="종료날짜를 선택해 주세요."
                    width="100%"
                    height={30}
                    minDateTime={new Date(form.formState.startDateTime)}
                  />
                </FormItem>
              )}
            </Form>
          </LeftColumn>

          {/* 오른쪽 컬럼 - 수신자 목록 */}
          <RightColumn>
            <RecipientHeader>
              <RecipientLabel>수신자 목록</RecipientLabel>
              <CreateModelButton onClick={handleAddMember} title="멤버 추가" />
            </RecipientHeader>
            <RecipientTableWrapper>
              <ReportReservationRecipientTable
                data={form.recipientTableData}
                onRemove={form.removeRecipient}
              />
            </RecipientTableWrapper>
          </RightColumn>
        </TwoColumnLayout>
      </Modal>

      <ReportReservationMemberModal />
    </>
  );
}

// ===== Styled Components =====
const TwoColumnLayout = styled.div`
  display: flex;
  gap: 16px;
`;

const LeftColumn = styled.div`
  width: 320px;
  flex-shrink: 0;
`;

const RightColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const RecipientHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const RecipientLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #000;
`;

const RecipientTableWrapper = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

type DatePickerWithDisabledProps = ComponentProps<typeof DatePicker> & {
  disabled?: boolean;
};

const BaseDatePicker = DatePicker as ComponentType<DatePickerWithDisabledProps>;

const StyledDatePicker = styled(BaseDatePicker)`
  & input {
    background-color: #fafafa !important;
    border-color: #b9bec3 !important;
    font-size: 12px;
  }
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
`;

const RequiredMark = styled.span`
  color: #f04438;
`;

const PeriodRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PeriodValue = styled.div`
  flex: 3;
`;

const PeriodUnit = styled.div`
  flex: 7;
`;

const WeekDaysRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0;
`;

const WeekDayItem = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .ant-radio-wrapper {
    .ant-radio + span {
      margin-left: 0px;
    }
  }
`;

const RadioRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid #e1e4e7;
  border-radius: 2px;
  background-color: #fafafa;
`;

const RadioItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;

  & + & {
    border-left: 1px solid #e1e4e7;
  }
`;
