import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/types/common/api.interface";

export interface GetPrivateRegistriesPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}
