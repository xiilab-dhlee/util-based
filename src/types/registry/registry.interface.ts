import type {
  CorePaginate,
  CoreSearchText,
} from "@/types/common/api.interface";

export interface GetPrivateRegistriesPayload
  extends CorePaginate,
    CoreSearchText {}

export interface GetPrivateRegistryImagesPayload extends CorePaginate {
  registryName?: string;
}

export interface GetPrivateRegistryImagePayload {
  registryName: string;
  imageId: number;
}

export interface GetPrivateRegistryImageTagsPayload
  extends CorePaginate,
    CoreSearchText {
  registryName?: string;
  imageId: number;
}

export interface GetPrivateRegistryImageTagVulnerabilityListPayload
  extends CorePaginate {
  tagId: number;
}

export interface DeletePrivateRegistryImagePayload
  extends GetPrivateRegistryImagePayload {}
