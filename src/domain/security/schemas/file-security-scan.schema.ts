import { z } from "zod";

// ===== 공통 상수 =====

/**
 * 파일 시스템 보안 검사 유형
 * - REGULAR: 정기 검사
 * - INDIVIDUAL: 개별 검사
 */
export const fileScanTypeSchema = z.enum(["REGULAR", "INDIVIDUAL"]);
export type FileScanType = z.infer<typeof fileScanTypeSchema>;

/**
 * 파일 시스템 보안 검사 상태
 * - IN_PROGRESS: 진행중
 * - FAILED: 실패
 * - COMPLETED: 완료
 */
export const fileScanStatusSchema = z.enum([
  "IN_PROGRESS",
  "FAILED",
  "COMPLETED",
]);
export type FileScanStatus = z.infer<typeof fileScanStatusSchema>;

// ===== Request 스키마 (프론트 → 서버) =====

/**
 * 파일 시스템 보안 검사 목록 조회 쿼리 스키마
 *
 * - 현재 UI에서는 page, size만 사용 중이며
 *   추후 정렬/필터가 추가되면 이 스키마에 필드를 확장합니다.
 */
export const fileSecurityScanListQuerySchema = z.object({
  /** 페이지 번호 (0-base) */
  page: z.number().int().min(0).optional(),
  /** 페이지 크기 */
  size: z.number().int().min(1).optional(),
  /** 정렬 조건 (예: "creatorDateTime,desc") */
  sort: z.string().optional(),
});

export type FileSecurityScanListQuery = z.infer<
  typeof fileSecurityScanListQuerySchema
>;

// ===== Response 스키마 (서버 → 프론트) =====

/** 파일 시스템 보안 검사 결과 공통 응답 스키마 */
const baseFileSecurityScanResponseSchema = z.object({
  /** 검사 ID */
  id: z.number().int(),
  /** 검사 유형 (정기/개별) */
  scanType: fileScanTypeSchema,
  /** 검사 상태 (진행중/실패/완료) */
  status: fileScanStatusSchema,
  /** 치명적(Critical) 취약점 수 */
  critical: z.number().int().min(0).max(9999),
  /** 높은(High) 취약점 수 */
  high: z.number().int().min(0).max(9999),
  /** 중간(Medium) 취약점 수 */
  medium: z.number().int().min(0).max(9999),
  /** 낮은(Low) 취약점 수 */
  low: z.number().int().min(0).max(9999),
  /** 검사 소요 시간 (초) */
  playtime: z.number().int().min(0),
  /** 실행자 */
  creatorName: z.string(),
  /** 검사일시 */
  creatorDateTime: z.string().datetime(),
});

/** 파일 시스템 보안 검사 목록 응답 스키마 */
export const fileSecurityScanListResponseSchema =
  baseFileSecurityScanResponseSchema;

/** 파일 시스템 보안 검사 상세 응답 스키마 */
export const fileSecurityScanDetailResponseSchema =
  baseFileSecurityScanResponseSchema.extend({
    /** 볼륨/모델 이름 */
    volumeName: z.string(),
    /** 파일 이름 */
    fileName: z.string(),
    /** 스캔 대상 경로 */
    targetPath: z.string(),
    /** 스캔된 파일 수 */
    scannedFileCount: z.number().int().min(0),
    /** 취약점 목록 */
    vulnerabilities: z
      .array(
        z.object({
          /** 취약점 ID */
          id: z.number().int(),
          /** 취약점명 */
          vulnerabilityName: z.string(),
          /** 취약점 설명 */
          description: z.string(),
          /** 심각도 */
          severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
          /** 파일 경로 */
          filePath: z.string(),
          /** 발견일시 */
          detectedAt: z.string().datetime(),
          /** 해결 상태 */
          resolved: z.boolean(),
        }),
      )
      .optional(),
  });

/** 취약점 검사 파일 목록 항목 응답 스키마 (검사 상세 페이지에서 사용) */
export const fileSecurityScanFileResponseSchema = z.object({
  /** 파일 ID */
  id: z.number().int(),
  /** 볼륨 이름 */
  volumeName: z.string(),
  /** 파일 이름 */
  fileName: z.string(),
  /** 파일 경로 */
  filePath: z.string(),
  /** 검사 상태 */
  status: fileScanStatusSchema,
  /** 치명적(Critical) 취약점 수 */
  critical: z.number().int().min(0),
  /** 높은(High) 취약점 수 */
  high: z.number().int().min(0),
  /** 중간(Medium) 취약점 수 */
  medium: z.number().int().min(0),
  /** 낮은(Low) 취약점 수 */
  low: z.number().int().min(0),
  /** 검사 소요 시간 (초) */
  playtime: z.number().int().min(0),
});

/** 취약점 상세 목록 항목 응답 스키마 (취약점 상세 페이지에서 사용) */
export const fileSecurityVulnerabilityDetailResponseSchema = z.object({
  /** 취약점 ID */
  id: z.number().int(),
  /** 취약점명 (CVE ID) */
  vulnerabilityName: z.string(),
  /** 심각도 */
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  /** NVD 점수 */
  nvd: z.number().min(0).max(10),
  /** RedHat 점수 */
  redhat: z.number().min(0).max(10),
  /** 패키지 이름 */
  packageName: z.string(),
  /** 현재 버전 */
  currentVersion: z.string(),
  /** 수정된 버전 */
  fixedVersion: z.string().nullable(),
});

/** 취약점 상세 정보 응답 스키마 (모달용 - 개별 취약점 조회 API) */
export const fileSecurityVulnerabilityInfoResponseSchema = z.object({
  /** 취약점 ID */
  id: z.number().int(),
  /** 취약점명 (CVE ID) */
  vulnerabilityName: z.string(),
  /** 취약점 설명 */
  description: z.string().nullable(),
  /** 제안 (해결 방안) */
  suggestion: z.string().nullable(),
  /** 상세 페이지 링크 (참조 URL) */
  referenceUrl: z.string().nullable(),
});

// ===== 타입 추출 =====

export type FileSecurityScanResultType = z.infer<
  typeof fileSecurityScanListResponseSchema
>;

export type FileSecurityScanDetailType = z.infer<
  typeof fileSecurityScanDetailResponseSchema
>;

export type FileSecurityScanFileType = z.infer<
  typeof fileSecurityScanFileResponseSchema
>;

export type FileSecurityVulnerabilityDetailType = z.infer<
  typeof fileSecurityVulnerabilityDetailResponseSchema
>;

export type FileSecurityVulnerabilityInfoType = z.infer<
  typeof fileSecurityVulnerabilityInfoResponseSchema
>;
