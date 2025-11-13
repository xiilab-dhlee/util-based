import type { CorePaginate, CoreSearchText } from "../common/api.interface";

export interface GetSourcecodesPayload extends CorePaginate, CoreSearchText {}

export interface CreateSourcecodePayload {
  [key: string]: any;
}

export interface UpdateSourcecodePayload {
  [key: string]: any;
}
