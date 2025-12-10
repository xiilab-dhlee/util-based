import { z } from "zod";

// ===== 스키마 =====

/**
 * SMTP 설정 폼 스키마
 */
export const smtpFormSchema = z.object({
  /** Hub(Gmail) 여부 */
  isGoogle: z.boolean(),
  /** SMTP 노드 주소 */
  nodeAddress: z.string().min(1, "SMTP 노드 주소를 입력해 주세요."),
  /** 노드 포트 번호 */
  nodePort: z
    .string()
    .min(1, "포트 번호를 입력해 주세요.")
    .refine(
      (value) => {
        if (!/^\d+$/.test(value)) return false;
        const numericValue = Number(value);
        return (
          Number.isInteger(numericValue) &&
          numericValue >= 1 &&
          numericValue <= 65535
        );
      },
      {
        message: "포트 번호는 1에서 65535 사이의 정수여야 합니다.",
      },
    ),
  /** 계정 */
  account: z.string().email("올바른 이메일 형식을 입력해 주세요."),
  /** 비밀번호 */
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

/**
 * SMTP 응답 스키마 (API 응답)
 */
export const smtpResponseSchema = z.object({
  id: z.number().int().positive(),
  /** Hub(Gmail) 여부 */
  isGoogle: z.boolean(),
  /** SMTP 노드 주소 */
  nodeAddress: z.string(),
  /** 노드 포트 번호 */
  nodePort: z.number().int().positive(),
  /** 계정 */
  account: z.string().email(),
});

/**
 * SMTP 생성 요청 페이로드 스키마
 */
export const createSmtpRequestSchema = z.object({
  isGoogle: z.boolean(),
  nodeAddress: z.string().min(1),
  nodePort: z
    .number()
    .int()
    .min(1, "포트 번호는 1 이상이어야 합니다.")
    .max(65535, "포트 번호는 65535 이하여야 합니다."),
  account: z.string().email("올바른 이메일 형식을 입력해 주세요."),
  password: z.string().min(1),
});

/**
 * SMTP 수정 요청 페이로드 스키마
 */
export const updateSmtpRequestSchema = createSmtpRequestSchema.extend({
  id: z.number().int().positive(),
});

// ===== 타입 =====

/** SMTP 폼 타입 */
export type SmtpFormType = z.infer<typeof smtpFormSchema>;

/** SMTP 응답 타입 */
export type SmtpResponseType = z.infer<typeof smtpResponseSchema>;

/** SMTP ID 타입 */
export type SmtpIdType = SmtpResponseType["id"];

/** SMTP 응답 타입 별칭 (서비스 계층에서 사용) */
export type SmtpResponse = SmtpResponseType;

/** SMTP 생성 요청 페이로드 타입 */
export type CreateSmtpRequestPayload = z.infer<typeof createSmtpRequestSchema>;

/** SMTP 수정 요청 페이로드 타입 */
export type UpdateSmtpRequestPayload = z.infer<typeof updateSmtpRequestSchema>;

/** SMTP 폼 에러 타입 */
export interface SmtpFormErrors {
  isGoogle?: string;
  nodeAddress?: string;
  nodePort?: string;
  account?: string;
  password?: string;
}
