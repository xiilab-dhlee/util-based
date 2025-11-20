import type {
  CreateCredentialPayload,
  GetCredentialsPayload,
} from "@/domain/credential/types/credential.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class CredentialService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/credential";

  /** 크레덴셜 목록 조회 */
  public getList(payload: GetCredentialsPayload) {
    const params = payloadToParams(payload);
    return this.getAxios().get(`${this.BASE_URL}`, { params });
  }

  /** 크레덴셜 생성 */
  public createCredential(payload: CreateCredentialPayload) {
    return this.getAxios().post(this.BASE_URL, payload);
  }
}
