import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

export interface GetInternalRegistriesPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}
