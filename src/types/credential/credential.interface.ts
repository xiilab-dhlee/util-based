import type { CorePaginate } from "../common/api.interface";
import type { Credential } from "./credential.model";

export type CredentialType = "GIT" | "DOCKER";

export interface GetCredentialsPayload extends CorePaginate {}
/**
 * 크레덴셜 생성 페이로드 타입
 */
export interface CreateCredentialPayload
  extends Pick<
    Credential,
    "name" | "description" | "privateRegistryUrl" | "type"
  > {
  id: string;
  pw: string;
}
