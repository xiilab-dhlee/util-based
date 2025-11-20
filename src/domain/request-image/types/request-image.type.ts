import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

export interface GetRequestImagesPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}

export interface GetWaitingRequestImagesPayload
  extends CorePayload,
    CoreSearchText {}
export interface CreateRequestImagePayload {
  // 이미지 요청 생성에 필요한 페이로드 타입
  [key: string]: unknown;
}

export interface UpdateRequestImagePayload {
  // 이미지 요청 수정에 필요한 페이로드 타입
  [key: string]: unknown;
}

export interface DeleteRequestImagePayload {
  id: string;
}
