import type { GetCredentialsPayload } from "@/types/credential/credential.interface";

const credentialKeys = {
  default: ["credential"],
  list: (payload: GetCredentialsPayload) => [
    ...credentialKeys.default,
    "list",
    ...Object.values(payload),
  ],
};

export default credentialKeys;
