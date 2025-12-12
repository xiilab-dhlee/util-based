import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";

/**
 * 워크로드 테스트 헬퍼
 *
 * 워크로드 관련 E2E 테스트에서 공통으로 사용하는 유틸리티 함수들
 */

// ============================================
// 상수 & 타입 정의
// ============================================

/** 필터 조건 인터페이스 */
export interface FilterCondition {
  search: string;
  jobType: string;
  status: string;
}

/** 잡타입 값 → UI 라벨 매핑 */
export const JOB_TYPE_LABELS: Record<string, string> = {
  BATCH: "Batch",
  INTERACTIVE: "Interactive",
  DISTRIBUTED: "Distributed",
};

/** 상태 값 → UI 라벨 매핑 */
export const STATUS_LABELS: Record<string, string> = {
  RUNNING: "실행중",
  PENDING: "대기중",
  ERROR: "에러",
  COMPLETED: "종료",
};

/** 상태 한글명 → 영문 값 매핑 */
export const STATUS_MAP: Record<string, string> = {
  실행중: "running",
  대기중: "pending",
  종료: "completed",
  에러: "failed",
};

/** 모니터링 차트 타입 매핑 */
export const CHART_MAP: Record<string, string> = {
  "CPU 사용량": "cpu-usage",
  "Memory 사용량": "memory-usage",
  "GPU 사용률": "gpu-utilization",
  "GPU 메모리": "gpu-memory",
};

// ============================================
// 버튼 & 셀렉터
// ============================================

/**
 * 버튼 이름과 셀렉터 매핑
 * Feature 파일의 버튼 이름을 data-testid로 변환
 */
/** 목록 페이지 버튼 셀렉터 매핑 */
export const WORKLOAD_BUTTON_MAP: Record<string, string> = {
  로그: WORKLOAD_SELECTOR.LOG_BUTTON,
  웹터미널: WORKLOAD_SELECTOR.TERMINAL_BUTTON,
  모니터링: WORKLOAD_SELECTOR.MONITORING_BUTTON,
  종료: WORKLOAD_SELECTOR.STOP_BUTTON,
  삭제: WORKLOAD_SELECTOR.DELETE_BUTTON,
  재시작: WORKLOAD_SELECTOR.RESTART_BUTTON,
};

/** 상세 페이지 버튼 셀렉터 매핑 */
export const DETAIL_BUTTON_MAP: Record<string, string> = {
  수정: WORKLOAD_SELECTOR.DETAIL_EDIT_BUTTON,
  종료: WORKLOAD_SELECTOR.DETAIL_STOP_BUTTON,
  재시작: WORKLOAD_SELECTOR.DETAIL_RESTART_BUTTON,
  삭제: WORKLOAD_SELECTOR.DETAIL_DELETE_BUTTON,
};

/** 생성 드로어 버튼 셀렉터 매핑 */
export const CREATE_BUTTON_MAP: Record<string, string> = {
  "최근 워크로드 가져오기": WORKLOAD_SELECTOR.CREATE_RECENT_IMPORT_BUTTON,
  "워크로드 목록에서 가져오기": WORKLOAD_SELECTOR.CREATE_LIST_IMPORT_BUTTON,
};
