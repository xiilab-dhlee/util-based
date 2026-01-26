import { z } from "zod";

/**
 * 라이선스 키 공통 유효성 스키마
 * 모든 라이선스 관련 폼에서 동일한 검증 규칙을 사용합니다.
 */
export const licenseKeySchema = z
  .string()
  .min(1, "라이선스 키를 입력해 주세요.")
  .regex(
    /^[0-9A-Za-z-]+$/,
    "라이선스 키는 영문, 숫자, 하이픈(-)만 포함할 수 있습니다.",
  );

/**
 * 라이선스 폼 스키마
 */
export const licenseFormSchema = z.object({
  licenseKey: licenseKeySchema,
});

export type LicenseFormType = z.infer<typeof licenseFormSchema>;
