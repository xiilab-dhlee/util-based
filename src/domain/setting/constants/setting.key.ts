import type { GetCredentialsPayload } from "@/domain/credential/types/credential.type";

export const settingKeys = {
  default: ["setting"],
  credentialList: (payload: GetCredentialsPayload) => [
    ...settingKeys.default,
    "credential",
    ...Object.values(payload),
  ],
};
