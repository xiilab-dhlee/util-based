import type { GetStoragesPayload } from "@/domain/storage/types/storage.interface";

export const storageKeys = {
  default: ["storage"],
  list: (payload: GetStoragesPayload) => [
    ...storageKeys.default,
    "list",
    ...Object.values(payload),
  ],
  listAll: () => [...storageKeys.default, "list", "all"],
};
