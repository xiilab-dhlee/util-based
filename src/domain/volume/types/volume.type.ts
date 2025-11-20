import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

export interface GetVolumesPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}

export interface GetVolumeFilesPayload extends CorePayload {
  id: string;
  path: string;
}
export interface CreateVolumePayload {
  [key: string]: unknown;
}

export interface UpdateVolumePayload {
  [key: string]: unknown;
}

export interface CompressVolumeFilePayload {
  [key: string]: unknown;
}

export interface CreateVolumeFolderPayload {
  [key: string]: unknown;
}
