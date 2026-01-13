import type { GetCredentialsPayload } from "@/domain/credential/types/credential.type";

export const credentialKeys = {
  default: ["credential"],
  list: (payload: GetCredentialsPayload) => [
    ...credentialKeys.default,
    "list",
    ...Object.values(payload),
  ],
  allList: () => [...credentialKeys.default, "allList"],
  options: (searchText: string) => [
    ...credentialKeys.default,
    "options",
    searchText,
  ],
  detail: (id: number | null) => [...credentialKeys.default, "detail", id],
};
