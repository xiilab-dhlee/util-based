import type { StorageSettingIdType } from "@/domain/system-setting/schemas/storage-setting.schema";

/** 스토리지 설정 React Query 키 */
export const storageSettingKeys = {
  default: ["system-setting", "storage"],
  list: (page: number, size: number) => [
    ...storageSettingKeys.default,
    "list",
    { page, size },
  ],
  detail: (id: StorageSettingIdType) => [
    ...storageSettingKeys.default,
    "detail",
    id,
  ],
  create: () => [...storageSettingKeys.default, "create"],
  update: () => [...storageSettingKeys.default, "update"],
  delete: () => [...storageSettingKeys.default, "delete"],
};
