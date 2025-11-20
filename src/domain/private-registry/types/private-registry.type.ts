import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

export interface GetPrivateRegistriesPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}
