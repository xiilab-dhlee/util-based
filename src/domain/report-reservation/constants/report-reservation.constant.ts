import {
  TRANSMISSION_STATUS_VALUES,
  type TransmissionStatus,
} from "@/domain/report-reservation/schemas/report-reservation.schema";

/**
 * 예약 목록 페이지 크기
 */
export const RESERVATION_LIST_PAGE_SIZE = 7;

/**
 * 발송 내역 목록 페이지 크기
 */
export const DISPATCH_HISTORY_LIST_PAGE_SIZE = 7;

/**
 * 발송 내역 상세 수신 목록 테이블 페이지 크기
 */
export const DISPATCH_RECIPIENT_TABLE_PAGE_SIZE = 10;

/**
 * 전송 상태 객체 타입
 * @description 값 배열에서 키-값이 동일한 객체 타입 생성
 */
type TransmissionStatusRecord = { readonly [K in TransmissionStatus]: K };

/**
 * 전송 상태 상수
 * @description 스키마의 TRANSMISSION_STATUS_VALUES에서 파생됨
 * 배열을 객체 형태로 변환하여 TRANSMISSION_STATUS.SUCCESS 형식으로 접근 가능
 */
export const TRANSMISSION_STATUS = Object.fromEntries(
  TRANSMISSION_STATUS_VALUES.map((v) => [v, v]),
) as TransmissionStatusRecord;

/**
 * 전송 상태 값 타입
 * @description 스키마의 TransmissionStatus 타입에서 파생
 */
export type TransmissionStatusValue = TransmissionStatus;

/**
 * 전송 상태 텍스트
 */
export const TRANSMISSION_STATUS_TEXT: Record<TransmissionStatusValue, string> =
  {
    [TRANSMISSION_STATUS.SUCCESS]: "성공",
    [TRANSMISSION_STATUS.FAILURE]: "실패",
  };

/**
 * 전송 상태 라벨 조회 함수
 */
export const getTransmissionStatusLabel = (
  status: TransmissionStatusValue,
): string => {
  return TRANSMISSION_STATUS_TEXT[status];
};

// ===== 리포트 예약 폼 관련 상수 =====

/**
 * 발송 주기 단위 값 배열 (Zod enum 검증용)
 */
export const PERIOD_UNIT_VALUES = ["day", "week", "month"] as const;

/**
 * 발송 주기 단위 타입 (상수에서 파생)
 */
export type ReportReservationPeriodUnit = (typeof PERIOD_UNIT_VALUES)[number];

export const REPORT_RESERVATION_PERIOD_UNIT_DAY: ReportReservationPeriodUnit =
  "day";
export const REPORT_RESERVATION_PERIOD_UNIT_WEEK: ReportReservationPeriodUnit =
  "week";
export const REPORT_RESERVATION_PERIOD_UNIT_MONTH: ReportReservationPeriodUnit =
  "month";

export interface ReportReservationPeriodUnitOption {
  key: ReportReservationPeriodUnit;
  label: string;
}

/**
 * 발송 주기 단위 옵션
 */
export const REPORT_RESERVATION_PERIOD_UNITS: ReportReservationPeriodUnitOption[] =
  [
    { key: REPORT_RESERVATION_PERIOD_UNIT_DAY, label: "일" },
    { key: REPORT_RESERVATION_PERIOD_UNIT_WEEK, label: "주" },
    { key: REPORT_RESERVATION_PERIOD_UNIT_MONTH, label: "개월" },
  ];

/**
 * 사용 여부 값 배열 (Zod enum 검증용)
 */
export const USAGE_STATUS_VALUES = ["enabled", "disabled"] as const;

/**
 * 사용 여부 타입 (상수에서 파생)
 */
export type ReportReservationUsageStatus = (typeof USAGE_STATUS_VALUES)[number];

export const REPORT_RESERVATION_USAGE_ENABLED: ReportReservationUsageStatus =
  "enabled";
export const REPORT_RESERVATION_USAGE_DISABLED: ReportReservationUsageStatus =
  "disabled";

export interface ReportReservationUsageOption {
  key: ReportReservationUsageStatus;
  label: string;
}

/**
 * 사용 여부 옵션
 */
export const REPORT_RESERVATION_USAGE_OPTIONS: ReportReservationUsageOption[] =
  [
    { key: REPORT_RESERVATION_USAGE_ENABLED, label: "사용" },
    { key: REPORT_RESERVATION_USAGE_DISABLED, label: "미사용" },
  ];

// 발송 주기 옵션 re-export
export {
  DISPATCH_CYCLE_OPTIONS,
  type DispatchCycleOption,
} from "@/domain/report-reservation/schemas/report-reservation.schema";
// 공통 요일 상수 re-export
export {
  WEEK_DAYS as REPORT_RESERVATION_WEEK_DAYS,
  type WeekDayKey as ReportReservationWeekDayKey,
} from "@/shared/constants/date.constant";
