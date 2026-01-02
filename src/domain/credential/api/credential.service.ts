import type {
  CreateCredentialPayload,
  GetCredentialsPayload,
} from "@/domain/credential/types/credential.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class CredentialService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/credential";

  /** 크리덴셜 목록 조회 */
  public getList(payload: GetCredentialsPayload) {
    const params = payloadToParams(payload);
    return this.getAxios().get(`${this.BASE_URL}`, { params });
  }

  /** 크리덴셜 상세 조회 */
  public getDetail(id: number) {
    return this.getAxios().get(`${this.BASE_URL}/${id}`);
  }

  /** 크리덴셜 생성 */
  public createCredential(payload: CreateCredentialPayload) {
    return this.getAxios().post(this.BASE_URL, payload);
  }

  /** 크리덴셜 삭제 */
  public deleteCredential(id: number) {
    return this.getAxios().delete(`${this.BASE_URL}/${id}`);
  }
}
