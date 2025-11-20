import type { CorePaginate, CorePayload } from "@/shared/types/api.interface";

export type CredentialType = "GIT" | "DOCKER";

export interface GetCredentialsPayload extends CorePayload, CorePaginate {}
/**
 * 크레덴셜 생성 페이로드 타입
 */
export interface CreateCredentialPayload {
  [key: string]: unknown;
}
