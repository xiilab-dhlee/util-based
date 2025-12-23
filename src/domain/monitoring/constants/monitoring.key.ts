import type { GetUserResourcesPayload } from "@/domain/monitoring/types/monitoring.type";

export const userResourceKeys = {
  default: ["user-resource"],
  // Query keys
  list: (payload: GetUserResourcesPayload) => [
    ...userResourceKeys.default,
    "list",
    payload,
  ],
};
