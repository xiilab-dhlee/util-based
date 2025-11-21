import type {
  GetAccountsPayload,
  GetPendingAccountsPayload,
} from "@/domain/account-management/types/account.type";

export const accountKeys = {
  default: ["account"],
  list: (payload: GetAccountsPayload) => [
    ...accountKeys.default,
    "list",
    ...Object.values(payload),
  ],
  pendingList: (payload: GetPendingAccountsPayload) => [
    ...accountKeys.default,
    "pendingList",
    ...Object.values(payload),
  ],
  detail: (id: string) => [...accountKeys.default, "detail", id],
};
