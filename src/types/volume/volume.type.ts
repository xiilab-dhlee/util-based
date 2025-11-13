import type { CorePaginate, CoreSearchText } from "../common/api.interface";

export interface GetVolumesPayload extends CorePaginate, CoreSearchText {}

export interface GetVolumeFilesPayload {
  id: string;
  path: string;
}
export interface CreateVolumePayload {
  [key: string]: any;
}

export interface UpdateVolumePayload {
  [key: string]: any;
}

export interface CompressVolumeFilePayload {
  [key: string]: any;
}

export interface CreateVolumeFolderPayload {
  [key: string]: any;
}
