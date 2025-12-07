/** 스토리지 설정 React Query 키 */
export const storageSettingKeys = {
  default: ["system-setting", "storage"],
  list: (page: number) => [...storageSettingKeys.default, "list", page],
  create: () => [...storageSettingKeys.default, "create"],
  update: () => [...storageSettingKeys.default, "update"],
  delete: () => [...storageSettingKeys.default, "delete"],
};
