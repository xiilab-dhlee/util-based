import { z } from "zod";

/**
 * HPE 폼 스키마
 * 사용자가 입력하는 HPE 연동 정보 검증
 */
export const hpeFormSchema = z.object({
  id: z.string().min(1, "ID를 입력해 주세요."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
  serverIp: z
    .string()
    .min(1, "Server IP를 입력해 주세요.")
    .regex(
      /^(\d{1,3}\.){3}\d{1,3}$/,
      "Server IP를 잘못입력하셨습니다. 다시 입력해 주세요.",
    ),
});

/**
 * HPE 상세 정보 스키마
 * 백엔드에서 반환하는 HPE 연동 정보
 */
export const hpeDetailSchema = z.object({
  id: z.string(),
  serverIp: z.string(),
  isConnected: z.boolean(),
  lastUpdatedAt: z.string().datetime(),
});

/**
 * HPE 연동 요청 스키마
 * PUT 요청 시 전송되는 데이터
 */
export const updateHpeRequestSchema = z.object({
  id: z.string(),
  password: z.string(),
  serverIp: z.string(),
});

// TypeScript 타입 추론
export type HpeFormType = z.infer<typeof hpeFormSchema>;
export type HpeDetailType = z.infer<typeof hpeDetailSchema>;
export type UpdateHpeRequestType = z.infer<typeof updateHpeRequestSchema>;

// 폼 에러 타입
export interface HpeFormErrors {
  id?: string;
  password?: string;
  serverIp?: string;
}
