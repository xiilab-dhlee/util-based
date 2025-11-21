import type { GetCredentialsPayload } from "@/domain/credential/types/credential.type";
import type {
  GetWorkspaceMembersPayload,
  GetWorkspaceRequestResourcesPayload,
} from "@/domain/workspace/types/workspace.type";

export const settingKeys = {
  default: ["setting"],
  memberList: (payload: GetWorkspaceMembersPayload) => [
    ...settingKeys.default,
    "memberList",
    ...Object.values(payload),
  ],
  requestResourceList: (payload: GetWorkspaceRequestResourcesPayload) => [
    ...settingKeys.default,
    "requestResourceList",
    ...Object.values(payload),
  ],
  credentialList: (payload: GetCredentialsPayload) => [
    ...settingKeys.default,
    "credentialList",
    ...Object.values(payload),
  ],
};
