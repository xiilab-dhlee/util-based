import type { DropdownOption } from "xiilab-ui";

import {
  StorageCreateRequestStorageChannel as STORAGE_CHANNEL_TYPES,
  type StorageCreateRequestStorageChannel,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/** 스토리지 채널 타입 (API 스키마에서 가져온 타입) */
export type StorageChannelType = StorageCreateRequestStorageChannel;

/** 스토리지 채널별 라벨 */
export const STORAGE_CHANNEL_LABEL: Record<StorageChannelType, string> = {
  [STORAGE_CHANNEL_TYPES.NFS]: "NFS",
} as const;

/**
 * 스토리지 채널 옵션 (드롭다운용)
 */
export const STORAGE_CHANNEL_OPTIONS: DropdownOption[] = [
  {
    label: STORAGE_CHANNEL_LABEL[STORAGE_CHANNEL_TYPES.NFS],
    value: STORAGE_CHANNEL_TYPES.NFS,
  },
];

export const STORAGE_CARD_HEIGHT = 102;

/** API 스키마에서 가져온 스토리지 채널 타입 상수 재export */
export { STORAGE_CHANNEL_TYPES };
