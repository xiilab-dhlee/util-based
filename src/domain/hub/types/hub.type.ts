import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

export interface GetHubsPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}
