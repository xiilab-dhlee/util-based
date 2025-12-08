import type { CorePaginate, CorePayload } from "@/shared/types/api.interface";

export interface GetReportsPayload extends CorePayload, CorePaginate {
  reportDateType?: string; // WEEKLY | MONTHLY
  reportType?: string; // SYSTEM | CLUSTER
}

export interface GetReportDetailPayload {
  reportId: string;
}
