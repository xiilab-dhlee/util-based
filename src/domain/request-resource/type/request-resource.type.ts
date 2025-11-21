import type { CorePaginate, CorePayload } from "@/shared/types/api.interface";

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
