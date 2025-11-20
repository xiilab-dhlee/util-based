import type { GetPrivateRegistriesPayload } from "@/domain/private-registry/types/private-registry.type";

export const privateRegistryKeys = {
  default: ["private-registry"],
  // 내부 레지스트리 목록
  list: (payload: GetPrivateRegistriesPayload) => [
    ...privateRegistryKeys.default,
    "list",
    ...Object.values(payload),
  ],
};
