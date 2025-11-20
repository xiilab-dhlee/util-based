import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

export interface GetUsersPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}

export interface GetPendingUsersPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}

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
