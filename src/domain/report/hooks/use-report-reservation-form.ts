import { useCallback, useState } from "react";
import type { z } from "zod";

import type { GroupMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  type CreateReportReservationRequest,
  createReportReservationRequestSchema,
  type ReportReservationRecipient,
  type ReportType,
} from "@/domain/report/schemas/report.schema";
import {
  REPORT_RESERVATION_PERIOD_UNIT_DAY,
  REPORT_RESERVATION_PERIOD_UNIT_MONTH,
  REPORT_RESERVATION_PERIOD_UNIT_WEEK,
  REPORT_RESERVATION_USAGE_DISABLED,
  REPORT_RESERVATION_USAGE_ENABLED,
  type ReportReservationPeriodUnit,
  type ReportReservationWeekDayKey,
} from "@/domain/report-reservation/constants/report-reservation.constant";
import type { ReservationDetailType } from "@/domain/report-reservation/schemas/report-reservation.schema";

// ===== 타입 정의 =====

/**
 * 리포트 예약 폼 값 타입 (검증 전)
 * - 스키마에서 타입을 추출하여 사용
 * - reportType만 빈 문자열("")을 허용 (미선택 상태)
 */
export type ReportReservationFormValue = Omit<
  CreateReportReservationRequest,
  "reportType"
> & {
  reportType: ReportType | "";
};

/**
 * 검증된 폼 값 타입 (검증 후)
 * - 스키마에서 직접 추론
 */
export type ValidatedFormValue = z.infer<
  typeof createReportReservationRequestSchema
>;

interface ReportReservationFormErrors {
  name?: string;
  description?: string;
  reportType?: string;
  startDateTime?: string;
  periodValue?: string;
  periodUnit?: string;
  weekDays?: string;
  endDateUsage?: string;
  endDateTime?: string;
  recipients?: string;
}

interface UseReportReservationFormReturn {
  /** 폼 상태 */
  formState: ReportReservationFormValue;
  /** 에러 상태 */
  errors: ReportReservationFormErrors;
  /** 수신자 테이블 표시용 데이터 */
  recipientTableData: GroupMemberResponse[];
  /** 필드 값 설정 */
  setField: <K extends keyof ReportReservationFormValue>(
    key: K,
    value: ReportReservationFormValue[K],
  ) => void;
  /** 수신자 목록 설정 */
  setRecipients: (members: GroupMemberResponse[]) => void;
  /** 수신자 삭제 */
  removeRecipient: (id: string) => void;
  /** 요일 토글 */
  toggleWeekDay: (dayKey: ReportReservationWeekDayKey) => void;
  /** 폼 검증 */
  validate: () => ValidatedFormValue | null;
  /** 폼 초기화 */
  reset: () => void;
  /** 상세 데이터로 폼 초기화 (수정 모드) */
  initializeFromDetail: (detail: ReservationDetailType) => void;
}

// ===== 기본값 =====

const DEFAULT_FORM_VALUE: ReportReservationFormValue = {
  name: "",
  description: "",
  reportType: "",
  startDateTime: new Date().toISOString(),
  periodValue: 2,
  periodUnit: REPORT_RESERVATION_PERIOD_UNIT_WEEK,
  weekDays: [],
  endDateUsage: REPORT_RESERVATION_USAGE_ENABLED,
  endDateTime: null,
  recipients: [],
};

// ===== 훅 =====

/**
 * 리포트 예약 폼 상태 및 검증 훅
 */
export function useReportReservationForm(): UseReportReservationFormReturn {
  const [formState, setFormState] =
    useState<ReportReservationFormValue>(DEFAULT_FORM_VALUE);
  const [errors, setErrors] = useState<ReportReservationFormErrors>({});
  const [recipientTableData, setRecipientTableData] = useState<
    GroupMemberResponse[]
  >([]);

  // 필드 값 설정
  const setField = useCallback(
    <K extends keyof ReportReservationFormValue>(
      key: K,
      value: ReportReservationFormValue[K],
    ) => {
      setFormState((prev) => ({
        ...prev,
        [key]: value,
      }));
      // 해당 필드 에러 클리어
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [],
  );

  // 수신자 목록 설정
  const setRecipients = useCallback((members: GroupMemberResponse[]) => {
    const recipients: ReportReservationRecipient[] = members
      .filter((m): m is GroupMemberResponse & { email: string } => !!m.email)
      .map((m) => ({
        id: m.accountId,
        name: m.accountName,
        email: m.email,
      }));
    setRecipientTableData(members);
    setFormState((prev) => ({ ...prev, recipients }));
    setErrors((prev) => ({ ...prev, recipients: undefined }));
  }, []);

  // 수신자 삭제
  const removeRecipient = useCallback((id: string) => {
    setRecipientTableData((prev) => prev.filter((m) => m.accountId !== id));
    setFormState((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((r) => r.id !== id),
    }));
  }, []);

  // 요일 토글
  const toggleWeekDay = useCallback((dayKey: ReportReservationWeekDayKey) => {
    setFormState((prev) => {
      const hasDay = prev.weekDays.includes(dayKey);
      const nextWeekDays = hasDay
        ? prev.weekDays.filter((key) => key !== dayKey)
        : [...prev.weekDays, dayKey];

      return {
        ...prev,
        weekDays: nextWeekDays,
      };
    });
    setErrors((prev) => ({ ...prev, weekDays: undefined }));
  }, []);

  // 폼 검증
  const validate = useCallback((): ValidatedFormValue | null => {
    const safeState = {
      ...formState,
      endDateTime:
        formState.endDateUsage === REPORT_RESERVATION_USAGE_ENABLED
          ? formState.endDateTime
          : null,
    };

    const result = createReportReservationRequestSchema.safeParse(safeState);

    if (!result.success) {
      const fieldErrors: ReportReservationFormErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ReportReservationFormErrors;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return null;
    }

    setErrors({});
    return result.data;
  }, [formState]);

  // 폼 초기화
  const reset = useCallback(() => {
    setFormState(DEFAULT_FORM_VALUE);
    setRecipientTableData([]);
    setErrors({});
  }, []);

  // 상세 데이터로 폼 초기화 (수정 모드)
  const initializeFromDetail = useCallback((detail: ReservationDetailType) => {
    // dispatchCycle 파싱 (예: "2주" -> periodValue: 2, periodUnit: "week")
    const { periodValue, periodUnit } = parseDispatchCycle(
      detail.dispatchCycle,
    );

    // dispatchDay 파싱 (요일인 경우)
    const weekDays: ReportReservationWeekDayKey[] = [];
    if (
      periodUnit === REPORT_RESERVATION_PERIOD_UNIT_WEEK &&
      typeof detail.dispatchDay === "string"
    ) {
      weekDays.push(detail.dispatchDay as ReportReservationWeekDayKey);
    }

    // 수신자 데이터 변환
    const recipients: ReportReservationRecipient[] = detail.recipients.map(
      (r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
      }),
    );

    // 백엔드 응답을 GroupMemberResponse 형식으로 변환
    const tableData: GroupMemberResponse[] = detail.recipients.map((r) => ({
      accountId: r.id,
      accountName: r.name,
      email: r.email,
    }));

    setFormState({
      name: detail.reportName,
      description: detail.description,
      reportType: detail.reportType,
      startDateTime: detail.startDateTime,
      periodValue,
      periodUnit,
      weekDays,
      endDateUsage: detail.endDateTime
        ? REPORT_RESERVATION_USAGE_ENABLED
        : REPORT_RESERVATION_USAGE_DISABLED,
      endDateTime: detail.endDateTime ?? null,
      recipients,
    });

    setRecipientTableData(tableData);
    setErrors({});
  }, []);

  return {
    formState,
    errors,
    recipientTableData,
    setField,
    setRecipients,
    removeRecipient,
    toggleWeekDay,
    validate,
    reset,
    initializeFromDetail,
  };
}

// ===== 유틸리티 함수 =====

/**
 * dispatchCycle 문자열을 periodValue와 periodUnit으로 파싱
 * @example "2주" -> { periodValue: 2, periodUnit: "week" }
 * @example "1개월" -> { periodValue: 1, periodUnit: "month" }
 * @example "3일" -> { periodValue: 3, periodUnit: "day" }
 */
function parseDispatchCycle(dispatchCycle: string): {
  periodValue: number;
  periodUnit: ReportReservationPeriodUnit;
} {
  const match = dispatchCycle.match(/^(\d+)(일|주|개월)$/);

  if (!match) {
    return { periodValue: 1, periodUnit: REPORT_RESERVATION_PERIOD_UNIT_DAY };
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  let periodUnit: ReportReservationPeriodUnit;
  switch (unit) {
    case "주":
      periodUnit = REPORT_RESERVATION_PERIOD_UNIT_WEEK;
      break;
    case "개월":
      periodUnit = REPORT_RESERVATION_PERIOD_UNIT_MONTH;
      break;
    default:
      periodUnit = REPORT_RESERVATION_PERIOD_UNIT_DAY;
  }

  return { periodValue: value, periodUnit };
}
