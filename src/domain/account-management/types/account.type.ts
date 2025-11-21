import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

export interface GetAccountsPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}

export interface GetPendingAccountsPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}

export interface CheckPasswordPayload {
  accountname: string;
  password: string;
}

export interface UpdateAccountPayload {
  [key: string]: unknown;
}

export interface DeleteAccountPayload {
  id: string;
}
