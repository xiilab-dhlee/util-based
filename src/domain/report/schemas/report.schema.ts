import { z } from "zod";

// ===== Response 스키마 (서버 → 프론트) =====

/** 리포트 기본 응답 스키마 */
const baseReportResponseSchema = z.object({
  /** 리포트 ID */
  id: z.string().uuid(),
  /** 리포트 이름 */
  reportName: z.string(),
  /** 리포트 타입 (주간/월간) */
  reportDateType: z.enum(["WEEKLY", "MONTHLY"]),
  /** 리포트 종류 (시스템/클러스터) */
  reportType: z.enum(["SYSTEM", "CLUSTER"]),
  /** 시작 날짜 */
  startDate: z.string().datetime(),
  /** 종료 날짜 */
  endDate: z.string().datetime(),
  /** 생성자 */
  creator: z.string(),
  /** 생성 일시 */
  createdAt: z.string().datetime(),
});

/** 리포트 목록 조회 응답 스키마 */
export const reportListResponseSchema = baseReportResponseSchema;

// ===== 타입 추출 =====

// Response 타입
export type ReportListType = z.infer<typeof reportListResponseSchema>;
