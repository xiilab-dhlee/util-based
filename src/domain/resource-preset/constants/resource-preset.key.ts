import type { GetResourcePresetsPayload } from "@/domain/resource-preset/types/resource-preset.type";

/**
 * 리소스 프리셋 React Query 키
 */
export const resourcePresetKeys = {
  all: ["resource-preset"] as const,
  list: (payload?: GetResourcePresetsPayload) =>
    [...resourcePresetKeys.all, "list", payload] as const,
  detail: (id: string) => [...resourcePresetKeys.all, "detail", id] as const,
};
