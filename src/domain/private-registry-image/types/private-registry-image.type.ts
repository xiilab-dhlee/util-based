import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

export interface GetPrivateRegistryImagesPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}

export interface GetAdminPrivateRegistryImagesPayload
  extends CorePayload,
    CorePaginate {
  registryName: string;
}

export interface GetAdminPrivateRegistryImagePayload {
  registryName: string;
  imageId: number;
}

export interface GetPrivateRegistryImageTagsPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {
  imageId: number;
}

export interface GetPrivateRegistryImageTagDetailPayload {
  imageId: number;
  tagId: number;
}

export interface GetPrivateRegistryImageVulnerabilityListPayload
  extends CorePayload,
    CorePaginate {
  imageId: number;
  tagId: number;
}

export interface GetAdminPrivateRegistryImageTagsPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {
  registryName: string;
  imageId: number;
}

export interface UpdatePrivateRegistryImagePayload extends CorePayload {}

export interface DeleteAdminPrivateRegistryImagePayload {
  registryName: string;
  imageId: number;
}
