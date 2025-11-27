import { z } from "zod";

// ===== 공통 상수 =====

/** 모니터링 알림 항목 코드 */
export const monitoringNotificationItemValues = [
  "GPU",
  "GPU_MEMORY",
  "CPU",
  "MEM",
] as const;

/** 모니터링 알림 연산자 코드 */
export const monitoringNotificationOperatorValues = [
  "greaterThan",
  "greaterThanOrEqual",
  "lessThanOrEqual",
  "lessThan",
] as const;

// ===== Response 스키마 (서버 → 프론트) =====

/** 알림 설정 응답 스키마 (숫자 타입) */
export const monitoringNotificationSettingResponseSchema = z.object({
  /** 항목 (GPU, CPU 등) */
  item: z.enum(monitoringNotificationItemValues),
  /** 연산자 (>, >=, <=, <) */
  operator: z.enum(monitoringNotificationOperatorValues),
  /** 임계값(%) */
  threshold: z.number().min(1).max(100),
  /** 지속시간(분) */
  duration: z.number().min(1).max(700),
});

/** 모니터링 알림 기본 응답 스키마 */
const baseMonitoringNotificationResponseSchema = z.object({
  /** 알림 아이디 */
  id: z.string().uuid(),
  /** 노드 이름 */
  nodeName: z.string(),
  /** IP 주소 */
  ip: z.string(),
  /** 알림 이름 */
  name: z.string(),
  /** 채널 */
  channel: z.string(),
  /** 발생일시 */
  creatorDateTime: z.string().datetime(),
  /** 알림 설명 */
  description: z.string().nullable(),
  /** 이메일 수신 여부 */
  isEmail: z.boolean(),
  /** 시스템 알림 여부 */
  isSystem: z.boolean(),
  /** 알림 설정 */
  settings: z.array(monitoringNotificationSettingResponseSchema),
});

/** 목록 조회 응답 스키마 */
export const monitoringNotificationListResponseSchema =
  baseMonitoringNotificationResponseSchema.pick({
    id: true,
    nodeName: true,
    ip: true,
    name: true,
    channel: true,
    creatorDateTime: true,
    isEmail: true,
    isSystem: true,
    settings: true,
  });

/** 상세 조회 응답 스키마 */
export const monitoringNotificationDetailResponseSchema =
  baseMonitoringNotificationResponseSchema;

// ===== Form 스키마 (프론트 폼 상태) =====

/** 알림 설정 폼 스키마 (문자열 타입) */
export const monitoringNotificationSettingFormSchema = z.object({
  item: z.string(),
  operator: z.string(),
  threshold: z.string(),
  duration: z.string(),
});

/** 모니터링 알림 폼 스키마 */
export const monitoringNotificationFormSchema = z.object({
  name: z.string(),
  nodeName: z.string(),
  isEmail: z.boolean(),
  isSystem: z.boolean(),
  settings: z.array(monitoringNotificationSettingFormSchema),
});

// ===== Request 스키마 (프론트 → 서버) =====

/**
 * 숫자 문자열을 검증하고 숫자로 변환하는 헬퍼
 * - 빈 문자열 거부
 * - 숫자로 변환 후 범위 검증
 */
const numericStringToBoundedNumber = (min: number, max: number) =>
  z
    .string()
    .refine(
      (value) => {
        if (value.trim() === "") return false;
        const parsed = Number(value);
        return Number.isFinite(parsed);
      },
      { message: "숫자 형식의 값이어야 합니다." },
    )
    .transform((value) => Number(value))
    .refine((value) => value >= min && value <= max, {
      message: `${min} 이상 ${max} 이하의 값이어야 합니다.`,
    });

/** 알림 설정 요청 스키마 (문자열 → 숫자 변환 + 검증) */
export const monitoringNotificationSettingRequestSchema = z.object({
  item: z.enum(monitoringNotificationItemValues),
  operator: z.enum(monitoringNotificationOperatorValues),
  threshold: numericStringToBoundedNumber(1, 100),
  duration: numericStringToBoundedNumber(1, 700),
});

/** 모니터링 알림 생성/수정 요청 스키마 */
export const monitoringNotificationRequestSchema = z
  .object({
    /** 알림 이름 */
    name: z.string().trim().min(1, "알림 이름을 입력해 주세요."),
    /** 노드 이름 */
    nodeName: z.string().min(1, "노드를 선택해 주세요."),
    /** 이메일 알림 여부 */
    isEmail: z.boolean(),
    /** 시스템 알림 여부 */
    isSystem: z.boolean(),
    /** 알림 설정 */
    settings: z.array(monitoringNotificationSettingRequestSchema).min(1),
  })
  .refine((data) => data.isEmail || data.isSystem, {
    message: "알림 채널을 1개 이상 선택해 주세요.",
  });

// ===== 타입 추출 =====

// Response 타입
export type MonitoringNotificationSettingResponseType = z.infer<
  typeof monitoringNotificationSettingResponseSchema
>;
export type MonitoringNotificationListResponseType = z.infer<
  typeof monitoringNotificationListResponseSchema
>;
export type MonitoringNotificationDetailResponseType = z.infer<
  typeof monitoringNotificationDetailResponseSchema
>;

// Form 타입
export type MonitoringNotificationSettingFormType = z.infer<
  typeof monitoringNotificationSettingFormSchema
>;
export type MonitoringNotificationFormType = z.infer<
  typeof monitoringNotificationFormSchema
>;

// Request 타입
export type MonitoringNotificationRequestInput = z.input<
  typeof monitoringNotificationRequestSchema
>;
export type MonitoringNotificationRequestPayload = z.output<
  typeof monitoringNotificationRequestSchema
>;
