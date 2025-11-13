import type { CorePaginate, CoreSearchText } from "../common/api.interface";

export interface GetRequestImagesPayload extends CorePaginate, CoreSearchText {}

export interface GetWaitingRequestImagesPayload extends CoreSearchText {}
export interface CreateRequestImagePayload {
  // 이미지 요청 생성에 필요한 페이로드 타입
  [key: string]: any;
}

export interface UpdateRequestImagePayload {
  // 이미지 요청 수정에 필요한 페이로드 타입
  [key: string]: any;
}

export interface DeleteRequestImagePayload {
  id: string;
}
