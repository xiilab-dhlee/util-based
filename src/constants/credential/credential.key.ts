import type { GetCredentialsPayload } from "@/types/credential/credential.type";

export const credentialKeys = {
  default: ["credential"],
  list: (payload: GetCredentialsPayload) => [
    ...credentialKeys.default,
    "list",
    ...Object.values(payload),
  ],
};
