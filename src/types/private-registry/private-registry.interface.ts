import type {
  CorePaginate,
  CoreSearchText,
} from "@/types/common/api.interface";

export interface GetPrivateRegistriesPayload
  extends CorePaginate,
    CoreSearchText {}

export interface GetPrivateRegistryImagesPayload
  extends CorePaginate,
    CoreSearchText {}
