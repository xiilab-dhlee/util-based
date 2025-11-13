import type {
  GetRequestImagesPayload,
  GetWaitingRequestImagesPayload,
} from "@/types/request-image/request-image.type";

const requestImageKeys = {
  default: ["requestImage"],
  list: (payload: GetRequestImagesPayload) => [
    ...requestImageKeys.default,
    "list",
    ...Object.values(payload),
  ],
  detail: (requestImageId: string) => [
    ...requestImageKeys.default,
    "detail",
    requestImageId,
  ],
  waitingList: (payload: GetWaitingRequestImagesPayload) => [
    ...requestImageKeys.default,
    "waitingList",
    ...Object.values(payload),
  ],
};

export default requestImageKeys;
