import type { GetStoragesPayload } from "@/types/storage/storage.interface";

export const storageKeys = {
  default: ["storage"],
  list: (payload: GetStoragesPayload) => [
    ...storageKeys.default,
    "list",
    ...Object.values(payload),
  ],
  listAll: () => [...storageKeys.default, "list", "all"],
};
