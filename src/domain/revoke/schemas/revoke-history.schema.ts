import { z } from "zod";

import {
  REVOKE_CRITERIA,
  REVOKE_HISTORY_DETAIL_TYPE,
} from "@/domain/revoke/constants/revoke-history.constant";

/**
 * 리소스 회수 이력 목록 아이템 응답 스키마
 *
 * - 실제 API 응답과 UI에서 사용하는 필드를 기준으로 정의합니다.
 * - 타입 정의는 `RevokeHistoryItemResponseType`을 사용합니다.
 */
export const revokeHistoryItemResponseSchema = z.object({
  /** 고유 ID */
  id: z.string(),
  /** 회수 일시 */
  revokedAt: z.string().datetime(),
  /** 검사 대상 개수 */
  targetCount: z.number(),
  /** 경고 워크로드 개수 */
  warningWorkloadCount: z.number(),
  /** 회수 워크로드 개수 */
  revokedWorkloadCount: z.number(),
  /** 회수된 GPU */
  revokedGpu: z.number().int().min(0),
  /** 회수된 CPU */
  revokedCpu: z.number().int().min(0),
  /** 회수된 Memory */
  revokedMemory: z.number().min(0),
});

/**
 * 리소스 회수 이력 상세 정보 스키마 (사이드바 UI용)
 */
export const revokeHistoryDetailResponseSchema = z.object({
  /** 고유 ID */
  id: z.string(),
  /** 생성자 */
  creatorName: z.string(),
  /** 생성일 */
  createdAt: z.string().datetime(),
  /** GPU 타입 */
  gpuType: z.string(),
  /** 회수 일시 */
  revokedAt: z.string().datetime(),
  /** 검사 대상 개수 */
  targetCount: z.number().int().min(0),
  /** 경고 워크로드 개수 */
  warningWorkloadCount: z.number().int().min(0),
  /** 회수 워크로드 개수 */
  revokedWorkloadCount: z.number().int().min(0),
  /** 회수된 GPU */
  revokedGpu: z.number().int().min(0),
  /** 회수된 CPU */
  revokedCpu: z.number().int().min(0),
  /** 회수된 Memory */
  revokedMemory: z.number().min(0),
});

/**
 * 리소스 회수 기준 아이템 스키마
 * NOTE: criteria의 jobType은 INTERACTIVE, BATCH만 사용 (DISTRIBUTED 제외)
 */
export const revokeCriteriaItemSchema = z.object({
  /** 잡 타입 */
  jobType: z.enum(["INTERACTIVE", "BATCH"]),
  /** GPU 임계값 (%) */
  gpuThreshold: z.number().min(0).max(100),
  /** Memory 임계값 (%) */
  memoryThreshold: z.number().min(0).max(100),
  /** CPU 임계값 (%) */
  cpuThreshold: z.number().min(0).max(100),
  /** 운영 시간 (시간) */
  operationHours: z.number().min(1).max(999),
  /** 경고 횟수 */
  warningCount: z.number().int().min(1).max(999),
  /** 회수 기준 (OR/AND) */
  revokeCriteria: z.enum([REVOKE_CRITERIA.OR, REVOKE_CRITERIA.AND]),
});

/**
 * 리소스 회수 기준 응답 스키마
 *
 * NOTE:
 * - 실제 API 응답은 { content: RevokeCriteriaItemType[] } 형태의 래퍼 구조를 사용합니다.
 * - UI 단에서는 배열 타입(RevokeCriteriaItemType[])만 필요하므로,
 *   훅에서 `response.data.content`를 반환하도록 분리합니다.
 */
export const revokeHistoryCriteriaResponseSchema = z.object({
  content: z.array(revokeCriteriaItemSchema),
});

/**
 * 경고/회수 목록 아이템 스키마
 * NOTE: jobType은 workload 스키마와 동일 (BATCH, INTERACTIVE, DISTRIBUTED)
 */
export const revokeHistoryDetailItemSchema = z.object({
  /** 워크스페이스 ID */
  workspaceId: z.string(),
  /** 워크로드 ID */
  workloadId: z.string(),
  /** 워크로드 이름 */
  workloadName: z.string(),
  /** 구분 (경고/회수) */
  type: z.enum([
    REVOKE_HISTORY_DETAIL_TYPE.WARNING,
    REVOKE_HISTORY_DETAIL_TYPE.REVOKED,
  ]),
  /** 워크스페이스 이름 */
  workspaceName: z.string(),
  /** 잡 타입 */
  jobType: z.enum(["BATCH", "INTERACTIVE", "DISTRIBUTED"]),
  /** GPU */
  gpu: z.number(),
  /** CPU */
  cpu: z.number(),
  /** Memory (bytes) */
  memory: z.number(),
  /** 생성자 */
  creatorName: z.string(),
  /** 생성 일시 */
  createdAt: z.string().datetime(),
});

// ===== 타입 추출 =====

/**
 * 리소스 회수 이력 목록 아이템 응답 타입
 *
 * - Zod 스키마를 단일 소스로 사용하기 위해 스키마에서 직접 추출합니다.
 */
export type RevokeHistoryItemResponseType = z.infer<
  typeof revokeHistoryItemResponseSchema
>;

/** 리소스 회수 이력 상세 정보 타입 */
export type RevokeHistoryDetailResponseType = z.infer<
  typeof revokeHistoryDetailResponseSchema
>;

/** 리소스 회수 기준 아이템 타입 */
export type RevokeCriteriaItemType = z.infer<typeof revokeCriteriaItemSchema>;

/** 리소스 회수 기준 응답 타입 (API 원본 형태) */
export type RevokeCriteriaResponseType = z.infer<
  typeof revokeHistoryCriteriaResponseSchema
>;

/** 경고/회수 목록 아이템 타입 */
export type RevokeHistoryDetailItemType = z.infer<
  typeof revokeHistoryDetailItemSchema
>;

// ===== 폼 스키마 =====

/**
 * 리소스 회수 기준 폼 스키마
 * - 폼 입력에서는 숫자 필드를 문자열로 받습니다.
 */
export const revokeCriteriaFormSchema = z.object({
  /** 잡 타입 */
  jobType: z.enum(["INTERACTIVE", "BATCH"]),
  /** GPU 임계값 (%) - 문자열 입력 */
  gpuThreshold: z.string().min(1, "GPU 임계값을 입력해 주세요."),
  /** Memory 임계값 (%) - 문자열 입력 */
  memoryThreshold: z.string().min(1, "Memory 임계값을 입력해 주세요."),
  /** CPU 임계값 (%) - 문자열 입력 */
  cpuThreshold: z.string().min(1, "CPU 임계값을 입력해 주세요."),
  /** 운영 시간 (시간) - 문자열 입력 */
  operationHours: z.string().min(1, "운영시간을 입력해 주세요."),
  /** 경고 횟수 - 문자열 입력 */
  warningCount: z.string().min(1, "경고 횟수를 입력해 주세요."),
  /** 회수 기준 (OR/AND) */
  revokeCriteria: z.enum([REVOKE_CRITERIA.OR, REVOKE_CRITERIA.AND]),
});

/**
 * 리소스 회수 기준 요청 페이로드 스키마
 * - 문자열을 숫자로 변환하고 검증합니다.
 */
export const revokeCriteriaRequestSchema = revokeCriteriaFormSchema.transform(
  (data) => ({
    jobType: data.jobType,
    gpuThreshold: Number(data.gpuThreshold),
    memoryThreshold: Number(data.memoryThreshold),
    cpuThreshold: Number(data.cpuThreshold),
    operationHours: Number(data.operationHours),
    warningCount: Number(data.warningCount),
    revokeCriteria: data.revokeCriteria,
  }),
);

/** 리소스 회수 기준 폼 타입 */
export type RevokeCriteriaFormType = z.infer<typeof revokeCriteriaFormSchema>;

/** 리소스 회수 기준 요청 페이로드 타입 */
export type RevokeCriteriaRequestPayload = z.infer<
  typeof revokeCriteriaRequestSchema
>;
