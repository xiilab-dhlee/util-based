import { z } from "zod";

import type { CoreListResponse } from "@/shared/types/core.model";

// ===== Response 스키마 (서버 → 프론트) =====

/** 스토리지 설정 기본 응답 스키마 */
const baseStorageSettingSchema = z.object({
  /** 스토리지 아이디 */
  id: z.number().int().positive(),
  /** 스토리지 이름 */
  storageName: z.string().min(1).max(100),
  /** 스토리지 타입 (NFS 등) */
  storageType: z.string(),
  /** IP 주소 */
  ip: z.string(),
  /** 스토리지 저장 Path */
  path: z.string(),
  /** 등록자 이름 */
  creatorName: z.string(),
  /** 등록일 */
  creatorDate: z.string().datetime(),
});

/** 목록 조회 응답 스키마 */
export const storageSettingListSchema = baseStorageSettingSchema.pick({
  id: true,
  storageName: true,
  ip: true,
  creatorName: true,
  creatorDate: true,
});

/** 상세 조회 응답 스키마 */
export const storageSettingDetailSchema = baseStorageSettingSchema.pick({
  id: true,
  storageName: true,
  storageType: true,
  ip: true,
  path: true,
});

// ===== Request 스키마 (프론트 → 서버) =====

/** 스토리지 생성 요청 스키마 */
export const createStorageSettingRequestSchema = z.object({
  storageName: z.string().min(1, "스토리지 이름을 입력해 주세요.").max(100),
  storageType: z.string().min(1, "스토리지 타입을 선택해 주세요."),
  ip: z
    .string()
    .min(1, "IP 주소를 입력해 주세요.")
    .refine(
      (value) => {
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipv4Regex.test(value)) return false;
        const octets = value.split(".").map(Number);
        return octets.every((octet) => octet >= 0 && octet <= 255);
      },
      {
        message: "올바른 IP 주소 형식을 입력해 주세요.",
      },
    ),
  path: z
    .string()
    .min(1, "스토리지 저장 PATH를 입력해 주세요.")
    .regex(/^\//, "경로는 /로 시작해야 합니다."),
});

/** 스토리지 수정 요청 스키마 (현재 UI 기준: 이름만 수정) */
export const updateStorageSettingRequestSchema = z.object({
  id: z.number().int().positive(),
  storageName: z.string().min(1).max(100),
});

// ===== 타입 추출 =====

/** 스토리지 설정 목록 타입 */
export type StorageSettingListType = z.infer<typeof storageSettingListSchema>;

/** 스토리지 설정 상세 타입 */
export type StorageSettingDetailType = z.infer<
  typeof storageSettingDetailSchema
>;

/** 스토리지 설정 목록 API 응답 타입 */
export type StorageSettingListResponse =
  CoreListResponse<StorageSettingListType>;

/** 스토리지 설정 상세 API 응답 타입 */
export type StorageSettingDetailResponse = StorageSettingDetailType;

/** 스토리지 설정 ID 타입 */
export type StorageSettingIdType = StorageSettingListType["id"];

/** 스토리지 생성 요청 페이로드 타입 */
export type CreateStorageSettingRequestPayload = z.infer<
  typeof createStorageSettingRequestSchema
>;

/** 스토리지 수정 요청 페이로드 타입 */
export type UpdateStorageSettingRequestPayload = z.infer<
  typeof updateStorageSettingRequestSchema
>;
