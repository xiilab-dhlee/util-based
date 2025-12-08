import type { GetReportsPayload } from "@/domain/report/types/report.type";

export const reportKeys = {
  default: ["report"],
  list: (payload: GetReportsPayload) => [
    ...reportKeys.default,
    "list",
    ...Object.values(payload),
  ],
  detail: (reportId: string) => [...reportKeys.default, "detail", reportId],
};
