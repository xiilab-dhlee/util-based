import type { GetAlertsPayload } from "@/types/alert/alert.type";

const alertKeys = {
  default: ["alert"],
  list: (payload: GetAlertsPayload) => [
    ...alertKeys.default,
    "list",
    ...Object.values(payload),
  ],
  detail: (id: string) => [...alertKeys.default, "detail", id],
};

export default alertKeys;
