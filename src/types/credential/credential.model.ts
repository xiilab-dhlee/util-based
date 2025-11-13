import type { CredentialType } from "./credential.interface";

/**
 * 크레덴셜 모델
 */
export interface Credential {
  id: number;
  name: string;
  description: string;
  type: CredentialType;
  loginId?: string;
  loginPw?: string;
  privateRegistryUrl?: string;
  createdAt: string;
  creator?: string;
  creatorId?: string;
  creatorUserName?: string;
}
