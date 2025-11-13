import type { CorePaginate, CoreSearchText } from "../common/api.interface";

export interface GetUsersPayload extends CorePaginate, CoreSearchText {}

export interface GetPendingUsersPayload extends CorePaginate, CoreSearchText {}

export interface CheckPasswordPayload {
  username: string;
  password: string;
}

export interface UpdateUserPayload {
  [key: string]: unknown;
}

export interface DeleteUserPayload {
  id: string;
}
