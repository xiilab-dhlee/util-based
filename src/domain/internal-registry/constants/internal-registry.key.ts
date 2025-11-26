import type { GetInternalRegistriesPayload } from "@/domain/internal-registry/types/internal-registry.type";

export const internalregistryKeys = {
  default: ["internal-registry"],
  // 내부 레지스트리 목록
  list: (payload: GetInternalRegistriesPayload) => [
    ...internalregistryKeys.default,
    "list",
    ...Object.values(payload),
  ],
};
