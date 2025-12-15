import type { WorkspaceRequestResourceStatus } from "@/domain/workspace/types/workspace.type";
import type { AllOptionValue } from "@/shared/constants/core.constant";
import type { CorePaginate, CorePayload } from "@/shared/types/api.interface";

/** 리소스 신청 상태 필터 타입 */
export type RequestResourceStatusFilter =
  | WorkspaceRequestResourceStatus
  | AllOptionValue
  | null;

export interface GetRequestResourcesPayload extends CorePayload, CorePaginate {}

export interface CreateRequestResourcePayload {
  [key: string]: unknown;
}

export interface UpdateRequestResourcePayload {
  [key: string]: unknown;
}

export interface DeleteRequestResourcePayload {
  id: string;
}
