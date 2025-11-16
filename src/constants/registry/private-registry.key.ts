import type { GetPrivateRegistriesPayload } from "@/types/private-registry/private-registry.type";

export const registryKeys = {
  default: ["private-registry"],
  // 내부 레지스트리 목록
  privateRegistryList: (payload: GetPrivateRegistriesPayload) => [
    ...registryKeys.default,
    "list",
    ...Object.values(payload),
  ],
};
