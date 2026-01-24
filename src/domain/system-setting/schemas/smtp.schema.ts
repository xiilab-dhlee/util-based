import { z } from "zod";

// ===== 상수 =====

export const SMTP_HOST_MAX_LENGTH = 50;
export const SMTP_EMAIL_MAX_LENGTH = 200;
export const SMTP_PASSWORD_MAX_LENGTH = 255;
export const SMTP_PORT_MIN = 1;
export const SMTP_PORT_MAX = 65535;

// ===== 스키마 =====

/**
 * SMTP 설정 폼 스키마
 * orval SmtpSetRequest 필드명과 일치
 */
export const smtpFormSchema = z.object({
  /** Google SMTP 여부 (UI 전용) */
  isGoogle: z.boolean(),
  /** SMTP 서버 호스트 주소 */
  host: z
    .string()
    .min(1, "SMTP 호스트 주소를 입력해 주세요.")
    .max(
      SMTP_HOST_MAX_LENGTH,
      `최대 ${SMTP_HOST_MAX_LENGTH}자까지 입력 가능합니다.`,
    ),
  /** SMTP 서버 포트 번호 */
  hostPort: z
    .string()
    .min(1, "포트 번호를 입력해 주세요.")
    .refine(
      (value) => {
        if (!/^\d+$/.test(value)) return false;
        const numericValue = Number(value);
        return (
          Number.isInteger(numericValue) &&
          numericValue >= SMTP_PORT_MIN &&
          numericValue <= SMTP_PORT_MAX
        );
      },
      {
        message: `포트 번호는 ${SMTP_PORT_MIN}에서 ${SMTP_PORT_MAX} 사이의 정수여야 합니다.`,
      },
    ),
  /** SMTP 계정 이메일 주소 */
  email: z
    .string()
    .min(1, "이메일을 입력해 주세요.")
    .email("올바른 이메일 형식을 입력해 주세요.")
    .max(
      SMTP_EMAIL_MAX_LENGTH,
      `최대 ${SMTP_EMAIL_MAX_LENGTH}자까지 입력 가능합니다.`,
    ),
  /** SMTP 계정 비밀번호 */
  password: z
    .string()
    .min(1, "비밀번호를 입력해 주세요.")
    .max(
      SMTP_PASSWORD_MAX_LENGTH,
      `최대 ${SMTP_PASSWORD_MAX_LENGTH}자까지 입력 가능합니다.`,
    ),
});

// ===== 타입 =====

/** SMTP 폼 타입 */
export type SmtpFormType = z.infer<typeof smtpFormSchema>;
