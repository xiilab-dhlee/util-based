import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

export interface GetSourcecodesPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {
  /** 소스코드 타입 필터 (GIT_HUB, GIT_LAB, BIT_BUCKET) */
  type?: string;
}

export interface CreateSourcecodePayload {
  [key: string]: unknown;
}

export interface UpdateSourcecodePayload {
  [key: string]: unknown;
}
