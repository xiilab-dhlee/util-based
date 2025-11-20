import type {
  GetVolumeFilesPayload,
  GetVolumesPayload,
} from "@/domain/volume/types/volume.type";

export const volumeKeys = {
  default: ["volume"],
  list: (payload: GetVolumesPayload) => [
    ...volumeKeys.default,
    "list",
    ...Object.values(payload),
  ],
  detail: (id: string) => [...volumeKeys.default, "detail", id],
  fileList: (payload: GetVolumeFilesPayload) => [
    ...volumeKeys.default,
    "fileList",
    ...Object.values(payload),
  ],
};
