import type { GetHubsPayload } from "@/types/hub/hub.type";

export const hubKeys = {
  default: ["hub"],
  list: (payload: GetHubsPayload) => [
    ...hubKeys.default,
    "list",
    ...Object.values(payload),
  ],
  detail: (id: number) => [...hubKeys.default, "detail", id],
};
