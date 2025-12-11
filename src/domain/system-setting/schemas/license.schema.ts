import { z } from "zod";

/**
 * 라이선스 키 공통 유효성 스키마
 * 폼/요청 스키마에서 동일한 검증 규칙을 사용합니다.
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
 * 사용자가 입력하는 라이선스 키 검증
 */
export const licenseFormSchema = z.object({
  licenseKey: licenseKeySchema,
});

/**
 * 라이선스 상세 정보 스키마
 * 백엔드에서 반환하는 라이선스 정보
 */
export const licenseDetailSchema = z.object({
  id: z.number().int().positive(),
  licenseKey: z.string(),
  version: z.string(), // 백엔드가 키에서 파싱
  gpuCount: z.number().int().positive(), // 백엔드가 키에서 파싱
  expirationDate: z.string().datetime(), // 백엔드가 키에서 파싱 (ISO)
  registrationDate: z.string().datetime(), // 백엔드 자동 생성
});

/**
 * 라이선스 목록 응답 스키마
 * 현재 활성 라이선스 + 등록 이력
 */
export const licenseListResponseSchema = z.object({
  current: licenseDetailSchema.nullable(),
  history: z.array(licenseDetailSchema),
  totalCount: z.number().int().nonnegative(),
});

/**
 * 라이선스 갱신 요청 스키마
 * POST 요청 시 전송되는 데이터
 */
export const renewLicenseRequestSchema = z.object({
  licenseKey: licenseKeySchema,
});

// TypeScript 타입 추론
export type LicenseFormType = z.infer<typeof licenseFormSchema>;
export type LicenseDetailType = z.infer<typeof licenseDetailSchema>;
export type LicenseListResponseType = z.infer<typeof licenseListResponseSchema>;
export type RenewLicenseRequestType = z.infer<typeof renewLicenseRequestSchema>;

// 폼 에러 타입
export interface LicenseFormErrors {
  licenseKey?: string;
}
