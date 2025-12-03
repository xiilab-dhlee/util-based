import { z } from "zod";

// ===== Response 스키마 (서버 → 프론트) =====

/** 보안 검사 결과 공통 응답 스키마 */
const baseSecurityScanResponseSchema = z.object({
  /** 태그 아이디 */
  id: z.number().int(),
  /** 이미지 아이디 */
  imageId: z.number().int(),
  /** 이미지명 */
  imageName: z.string(),
  /** 태그명 */
  imageTag: z.string(),
  /** 검사 상태 */
  status: z.enum(["COMPLETED", "PENDING", "FAILED"]),
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
  /** 이미지 개수 */
  imageCount: z.number().int().min(0),
  /** 실행자 */
  creatorName: z.string(),
  /** 검사일시 */
  creatorDateTime: z.string().datetime(),
});

/** 보안 검사 목록 응답 스키마 */
export const securityScanListResponseSchema = baseSecurityScanResponseSchema;

// ===== 타입 추출 =====

export type SecurityScanResultType = z.infer<
  typeof securityScanListResponseSchema
>;
