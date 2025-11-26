import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

export interface GetInternalRegistryImagesPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}

export interface GetAdminInternalRegistryImagesPayload
  extends CorePayload,
    CorePaginate {
  registryName: string;
}

export interface GetAdminInternalRegistryImagePayload {
  registryName: string;
  imageId: number;
}

export interface GetInternalRegistryImageTagsPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {
  imageId: number;
}

export interface GetInternalRegistryImageTagDetailPayload {
  imageId: number;
  tagId: number;
}

export interface GetInternalRegistryImageVulnerabilityListPayload
  extends CorePayload,
    CorePaginate {
  imageId: number;
  tagId: number;
}

export interface GetAdminInternalRegistryImageTagsPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {
  registryName: string;
  imageId: number;
}

export interface UpdateInternalRegistryImagePayload extends CorePayload {}

export interface DeleteAdminInternalRegistryImagePayload {
  registryName: string;
  imageId: number;
}
