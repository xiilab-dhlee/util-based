import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "../common/api.interface";

export interface GetHubsPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}
