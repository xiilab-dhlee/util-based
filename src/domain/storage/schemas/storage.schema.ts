import { z } from "zod";

import { StorageCreateRequestStorageChannel } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/**
 * 스토리지 생성 스키마
 */
export const createStorageFormSchema = z.object({
  storageName: z
    .string()
    .min(1, "스토리지 이름을 입력해 주세요.")
    .max(50, "스토리지 이름은 50자 이내로 입력해 주세요."),
  storageChannel: z.nativeEnum(StorageCreateRequestStorageChannel, {
    errorMap: () => ({ message: "스토리지 타입을 선택해 주세요." }),
  }),
  storageIp: z
    .string()
    .min(1, "IP 주소를 입력해 주세요.")
    .refine(
      (value) => {
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipv4Regex.test(value)) return false;
        const octets = value.split(".").map(Number);
        return octets.every((octet) => octet >= 0 && octet <= 255);
      },
      { message: "올바른 IP 주소 형식을 입력해 주세요." },
    ),
  storageSavePath: z
    .string()
    .min(1, "스토리지 저장 PATH를 입력해 주세요.")
    .regex(/^\//, "경로는 /로 시작해야 합니다."),
});

/**
 * 스토리지 수정 스키마
 */
export const updateStorageFormSchema = z.object({
  storageName: z
    .string()
    .min(1, "스토리지 이름을 입력해 주세요.")
    .max(50, "스토리지 이름은 50자 이내로 입력해 주세요."),
});

/**
 * 스토리지 생성 폼 타입
 */
export type CreateStorageFormType = z.infer<typeof createStorageFormSchema>;

/**
 * 스토리지 수정 폼 타입
 */
export type UpdateStorageFormType = z.infer<typeof updateStorageFormSchema>;
