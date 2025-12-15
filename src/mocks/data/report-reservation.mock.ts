import type {
  DispatchDetailResponse,
  DispatchHistoryType,
  ReservationDetailType,
  ReservationListType,
} from "@/domain/report-reservation/schemas/report-reservation.schema";
import {
  dispatchDetailResponseSchema,
  dispatchHistoryResponseSchema,
  reservationDetailResponseSchema,
  reservationListResponseSchema,
} from "@/domain/report-reservation/schemas/report-reservation.schema";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 고정된 UUID 목록 (예약 ID용)
 */
const FIXED_RESERVATION_IDS = [
  "a10e8400-e29b-41d4-a716-446655440000",
  "a10e8400-e29b-41d4-a716-446655440001",
  "a10e8400-e29b-41d4-a716-446655440002",
  "a10e8400-e29b-41d4-a716-446655440003",
  "a10e8400-e29b-41d4-a716-446655440004",
  "a10e8400-e29b-41d4-a716-446655440005",
  "a10e8400-e29b-41d4-a716-446655440006",
  "a10e8400-e29b-41d4-a716-446655440007",
  "a10e8400-e29b-41d4-a716-446655440008",
  "a10e8400-e29b-41d4-a716-446655440009",
];

/**
 * 고정된 UUID 목록 (발송 내역 ID용)
 */
const FIXED_DISPATCH_IDS = [
  "b20e8400-e29b-41d4-a716-446655440000",
  "b20e8400-e29b-41d4-a716-446655440001",
  "b20e8400-e29b-41d4-a716-446655440002",
  "b20e8400-e29b-41d4-a716-446655440003",
  "b20e8400-e29b-41d4-a716-446655440004",
  "b20e8400-e29b-41d4-a716-446655440005",
  "b20e8400-e29b-41d4-a716-446655440006",
  "b20e8400-e29b-41d4-a716-446655440007",
  "b20e8400-e29b-41d4-a716-446655440008",
  "b20e8400-e29b-41d4-a716-446655440009",
];

/**
 * 전체 예약 목록 모킹 데이터 (100개)
 * 페이지네이션 테스트를 위한 충분한 데이터 제공
 */
export const reservationListMock: ReservationListType[] = Array.from(
  { length: 100 },
  (_, index) => ({
    ...makeMock(reservationListResponseSchema),
    // UUID 형식의 ID 생성
    id:
      FIXED_RESERVATION_IDS[index] ||
      `a10e8400-e29b-41d4-a716-44665544${String(index).padStart(4, "0")}`,
    reportName: `리포트 ${index + 1}`,
  }),
);

/**
 * 예약 상세 모킹 데이터 맵
 * ID별로 서로 다른 상세 데이터를 반환하기 위한 룩업 테이블
 */
export const reservationDetailMockMap: Record<string, ReservationDetailType> = {
  [FIXED_RESERVATION_IDS[0]]: {
    ...makeMock(reservationDetailResponseSchema),
    id: FIXED_RESERVATION_IDS[0],
    reportName: "시스템 보안 리포트",
    reportType: "SYSTEM",
    dispatchCycle: "1주",
    dispatchDay: "mon",
    isScheduled: true,
  },
  [FIXED_RESERVATION_IDS[1]]: {
    ...makeMock(reservationDetailResponseSchema),
    id: FIXED_RESERVATION_IDS[1],
    reportName: "클러스터 성능 분석",
    reportType: "CLUSTER",
    dispatchCycle: "1개월",
    dispatchDay: 15,
    isScheduled: true,
  },
  [FIXED_RESERVATION_IDS[2]]: {
    ...makeMock(reservationDetailResponseSchema),
    id: FIXED_RESERVATION_IDS[2],
    reportName: "일일 모니터링 리포트",
    reportType: "SYSTEM",
    dispatchCycle: "1일",
    dispatchDay: null,
    isScheduled: false,
  },
};

/**
 * 전체 발송 내역 목록 모킹 데이터 (100개)
 * 페이지네이션 테스트를 위한 충분한 데이터 제공
 */
export const dispatchHistoryListMock: DispatchHistoryType[] = Array.from(
  { length: 100 },
  (_, index) => ({
    ...makeMock(dispatchHistoryResponseSchema),
    // UUID 형식의 ID 생성
    id:
      FIXED_DISPATCH_IDS[index] ||
      `b20e8400-e29b-41d4-a716-44665544${String(index).padStart(4, "0")}`,
    reportName: `발송 리포트 ${index + 1}`,
    transmissionStatus: index % 3 === 0 ? "FAILURE" : "SUCCESS",
  }),
);

/**
 * 발송 내역 상세 모킹 데이터 맵
 * ID별로 서로 다른 상세 데이터를 반환하기 위한 룩업 테이블
 */
export const dispatchDetailMockMap: Record<string, DispatchDetailResponse> = {
  [FIXED_DISPATCH_IDS[0]]: {
    ...makeMock(dispatchDetailResponseSchema),
    id: FIXED_DISPATCH_IDS[0],
    title: "시스템 보안 리포트 발송",
    type: "SYSTEM",
    description: "주간 시스템 보안 점검 리포트입니다.",
  },
  [FIXED_DISPATCH_IDS[1]]: {
    ...makeMock(dispatchDetailResponseSchema),
    id: FIXED_DISPATCH_IDS[1],
    title: "클러스터 성능 분석 발송",
    type: "CLUSTER",
    description: "월간 클러스터 성능 분석 리포트입니다.",
  },
  [FIXED_DISPATCH_IDS[2]]: {
    ...makeMock(dispatchDetailResponseSchema),
    id: FIXED_DISPATCH_IDS[2],
    title: "일일 모니터링 리포트 발송",
    type: "SYSTEM",
    description: "매일 자동 발송되는 모니터링 리포트입니다.",
  },
};

// 하위 호환성을 위한 기본 export (첫 번째 항목)
export const reservationDetailMock =
  reservationDetailMockMap[FIXED_RESERVATION_IDS[0]];
export const dispatchDetailMock = dispatchDetailMockMap[FIXED_DISPATCH_IDS[0]];
