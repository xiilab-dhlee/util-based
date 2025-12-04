import type {
  FileSecurityScanDetailType,
  FileSecurityScanFileType,
  FileSecurityScanResultType,
  FileSecurityVulnerabilityDetailType,
  FileSecurityVulnerabilityInfoType,
} from "@/domain/security/schemas/file-security-scan.schema";
import type { VulnerabilityListType } from "@/domain/security/schemas/vulnerability.schema";
import type { CorePayload } from "@/shared/types/api.interface";
import type { CoreListResponse } from "@/shared/types/core.model";

// ============================================
// API Request Types
// ============================================

/** 파일 시스템 보안 검사 상세 조회 요청 */
export interface GetFileSecurityScanDetailPayload {
  scanId: number;
}

/** 파일 시스템 보안 검사 삭제 요청 */
export interface DeleteFileSecurityScanPayload {
  scanId: number;
}

/** 파일 시스템 보안 검사 파일 목록 조회 요청 */
export interface GetFileSecurityScanFileListPayload {
  [key: string]: string | number | boolean | undefined;
  /** 검사 ID (경로 파라미터에 사용) */
  scanId: number;
  /** 페이지 번호 (0-base) */
  page?: number;
  /** 페이지 크기 */
  size?: number;
}

/** 파일 시스템 보안 파일별 취약점 목록 조회 요청 */
export interface GetFileSecurityVulnerabilityDetailListPayload {
  [key: string]: string | number | boolean | undefined;
  /** 검사 ID (경로 파라미터에 사용) */
  scanId: number;
  /** 파일 ID (경로 파라미터에 사용) */
  fileId: number;
  /** 페이지 번호 (0-base) */
  page?: number;
  /** 페이지 크기 */
  size?: number;
}

/** 파일 시스템 보안 취약점 상세 정보 조회 요청 */
export interface GetFileSecurityVulnerabilityInfoPayload {
  scanId: number;
  fileId: number;
  vulnerabilityId: number;
}

/** 파일 시스템 보안 Critical 취약점 목록 조회 요청 */
export interface GetFileSecurityCriticalVulnerabilitiesPayload
  extends CorePayload {
  scanId: number;
}

/** 파일 보안 스케줄 설정 업데이트 요청 */
export interface UpdateSecurityScheduleSettingPayload {
  scheduleUsage: string;
  startDateTime: string;
  endDateUsage: string;
  endDateTime: string | null;
  periodValue: number;
  periodUnit: string;
  weekDays: string[];
}

/** 파일 보안 레벨 설정 업데이트 요청 */
export interface UpdateSecurityLevelSettingPayload {
  isEnabled: boolean;
  level: string;
  thresholdCount: number;
}

// ============================================
// API Response Types
// ============================================

/** 파일 시스템 보안 검사 목록 응답 (공통 목록 응답 포맷 사용) */
export type GetFileSecurityScanListResponse =
  CoreListResponse<FileSecurityScanResultType>;

/** 파일 시스템 보안 검사 상세 응답 */
export type GetFileSecurityScanDetailResponse = FileSecurityScanDetailType;

/** 파일 시스템 보안 검사 파일 목록 응답 (공통 목록 응답 포맷 사용) */
export type GetFileSecurityScanFileListResponse =
  CoreListResponse<FileSecurityScanFileType>;

/** 파일 시스템 보안 취약점 상세 목록 응답 (공통 목록 응답 포맷 사용) */
export type GetFileSecurityVulnerabilityDetailListResponse =
  CoreListResponse<FileSecurityVulnerabilityDetailType>;

/** 파일 시스템 보안 Critical 취약점 목록 응답 (공통 목록 응답 포맷 사용) */
export type GetFileSecurityCriticalVulnerabilitiesResponse =
  CoreListResponse<VulnerabilityListType>;

/** 파일 시스템 보안 취약점 상세 정보 응답 */
export type GetFileSecurityVulnerabilityInfoResponse =
  FileSecurityVulnerabilityInfoType;

// ============================================
// Component Props Types
// ============================================

/** 파일 시스템 보안 검사 목록 아이템 Props */
export interface FileSecurityScanItemProps {
  scan: FileSecurityScanResultType;
  onSelect?: (scan: FileSecurityScanResultType) => void;
}

/** 파일 시스템 보안 취약점 아이템 Props */
export interface FileSecurityVulnerabilityItemProps {
  vulnerability: FileSecurityVulnerabilityDetailType;
  onSelect?: (vulnerability: FileSecurityVulnerabilityDetailType) => void;
}
