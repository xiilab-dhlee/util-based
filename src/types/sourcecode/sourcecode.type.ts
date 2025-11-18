import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "../common/api.interface";

export interface GetSourcecodesPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}

export interface CreateSourcecodePayload {
  [key: string]: unknown;
}

export interface UpdateSourcecodePayload {
  [key: string]: unknown;
}
