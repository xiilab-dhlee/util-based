import type {
  GetPendingUsersPayload,
  GetUsersPayload,
} from "@/types/user/user.type";

export const userKeys = {
  default: ["user"],
  list: (payload: GetUsersPayload) => [
    ...userKeys.default,
    "list",
    ...Object.values(payload),
  ],
  pendingList: (payload: GetPendingUsersPayload) => [
    ...userKeys.default,
    "pendingList",
    ...Object.values(payload),
  ],
  detail: (id: string) => [...userKeys.default, "detail", id],
};
