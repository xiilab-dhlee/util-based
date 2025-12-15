import { z } from "zod";

import { WEEK_DAY_KEYS } from "@/shared/constants/date.constant";

/**
 * 발송 주기 옵션 (Mock용 임시 데이터)
 * TODO: 실제 API 연동 시 제거 예정
 */
export const DISPATCH_CYCLE_OPTIONS = [
  "1주",
  "2주",
  "3주",
  "4주",
  "1개월",
  "2개월",
  "3개월",
  "6개월",
  "1일",
  "3일",
  "7일",
] as const;

/**
 * 발송 주기 옵션 타입
 * - 주 단위: 1주, 2주, 3주, 4주
 * - 월 단위: 1개월, 2개월, 3개월, 6개월
 * - 일 단위: 1일, 3일, 7일
 */
export type DispatchCycleOption = (typeof DISPATCH_CYCLE_OPTIONS)[number];

/**
 * 발송 주기 스키마
 */
export const dispatchCycleSchema = z.enum(DISPATCH_CYCLE_OPTIONS);

/**
 * 발송일 - 요일 타입
 * 표시 시 WEEK_DAY_LABEL_MAP을 사용하여 라벨로 변환 (예: "mon" → "월")
 */
export const dispatchDayOfWeekSchema = z.enum(WEEK_DAY_KEYS);

/**
 * 발송일 - 일자 타입 (1 ~ 31)
 * 표시 시 "일"을 붙여서 사용 (예: `${day}일`)
 */
export const dispatchDayOfMonthSchema = z.number().int().min(1).max(31);

/**
 * 발송일 타입 (요일 또는 일자 또는 null)
 * - 주 단위: 요일 (mon ~ sun)
 * - 월 단위: 일자 (1 ~ 31)
 * - 일 단위: null
 */
export const dispatchDaySchema = z
  .union([dispatchDayOfWeekSchema, dispatchDayOfMonthSchema])
  .nullable();

/**
 * 리포트 종류 타입
 */
export const reportTypeSchema = z.enum(["SYSTEM", "CLUSTER"]);

/**
 * 전송 상태 값 배열 (단일 소스)
 * @description 이 배열이 전송 상태의 유일한 정의 소스입니다.
 * 상수 파일에서 이 배열을 import하여 객체 형태로 변환합니다.
 */
export const TRANSMISSION_STATUS_VALUES = ["SUCCESS", "FAILURE"] as const;

/**
 * 전송 상태 스키마
 * @description TRANSMISSION_STATUS_VALUES에서 파생됨
 */
export const transmissionStatusSchema = z.enum(TRANSMISSION_STATUS_VALUES);

/**
 * 예약 목록 응답 스키마
 */
export const reservationListResponseSchema = z.object({
  /** 예약 ID */
  id: z.string().uuid(),
  /** 리포트 이름 */
  reportName: z.string(),
  /** 리포트 종류 */
  reportType: reportTypeSchema,
  /** 수신자 수 */
  recipientCount: z.number().int().min(0),
  /** 발송주기 (예: "1주", "1개월", "3일") */
  dispatchCycle: dispatchCycleSchema,
  /** 발송일 (예: "mon", 15, null) */
  dispatchDay: dispatchDaySchema,
  /** 종료일시 */
  endDateTime: z.string().datetime().nullable(),
  /** 예약발송 활성화 여부 */
  isScheduled: z.boolean(),
});

/**
 * 발송 내역 응답 스키마
 */
export const dispatchHistoryResponseSchema = z.object({
  /** 발송 내역 ID */
  id: z.string().uuid(),
  /** 리포트 이름 */
  reportName: z.string(),
  /** 수신자 수 */
  recipientCount: z.number().int().min(0),
  /** 전송상태 */
  transmissionStatus: transmissionStatusSchema,
  /** 발송일시 */
  dispatchDateTime: z.string().datetime(),
});

/**
 * 수신자 정보 스키마
 */
export const recipientSchema = z.object({
  /** 수신자 이름 */
  name: z.string(),
  /** 수신자 이메일 */
  email: z.string().email(),
  /** 전송 결과 */
  result: transmissionStatusSchema,
});

/**
 * 발송 내역 상세 응답 스키마
 */
export const dispatchDetailResponseSchema = z.object({
  /** 발송 내역 ID */
  id: z.string().uuid(),
  /** 리포트 제목 */
  title: z.string(),
  /** 리포트 종류 */
  type: reportTypeSchema,
  /** 리포트 설명 */
  description: z.string(),
  /** 수신 목록 */
  recipients: z.array(recipientSchema),
});

/**
 * 예약 상세 수신자 정보 스키마
 */
export const reservationRecipientSchema = z.object({
  /** 수신자 ID */
  id: z.string().uuid(),
  /** 수신자 이름 */
  name: z.string(),
  /** 수신자 이메일 */
  email: z.string().email(),
});

/**
 * 예약 상세 응답 스키마
 */
export const reservationDetailResponseSchema = z.object({
  /** 예약 ID */
  id: z.string().uuid(),
  /** 리포트 이름 */
  reportName: z.string(),
  /** 리포트 설명 */
  description: z.string().default(""),
  /** 리포트 종류 */
  reportType: reportTypeSchema,
  /** 수신자 목록 */
  recipients: z.array(reservationRecipientSchema),
  /** 발송주기 (예: "1주", "1개월", "3일") */
  dispatchCycle: dispatchCycleSchema,
  /** 발송일 (예: "mon", 15, null) */
  dispatchDay: dispatchDaySchema,
  /** 시작일시 */
  startDateTime: z.string().datetime(),
  /** 종료일시 */
  endDateTime: z.string().datetime().nullable(),
  /** 예약발송 활성화 여부 */
  isScheduled: z.boolean(),
});

// ===== 타입 추출 =====

export type ReservationListType = z.infer<typeof reservationListResponseSchema>;
export type ReservationDetailType = z.infer<
  typeof reservationDetailResponseSchema
>;
export type ReservationRecipient = z.infer<typeof reservationRecipientSchema>;
export type DispatchHistoryType = z.infer<typeof dispatchHistoryResponseSchema>;
export type DispatchDetailResponse = z.infer<
  typeof dispatchDetailResponseSchema
>;
export type Recipient = z.infer<typeof recipientSchema>;
export type DispatchCycle = z.infer<typeof dispatchCycleSchema>;
export type DispatchDay = z.infer<typeof dispatchDaySchema>;
export type ReportType = z.infer<typeof reportTypeSchema>;
export type TransmissionStatus = z.infer<typeof transmissionStatusSchema>;
