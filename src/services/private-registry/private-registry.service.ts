import { AxiosService } from "@/services/common/axios";
import type { GetPrivateRegistriesPayload } from "@/types/private-registry/private-registry.type";
import { payloadToParams } from "@/utils/common/service.util";

export class PrivateRegistryService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/private-registry";

  /** 내부 레지스트리 목록 조회 */
  public async getList(payload: GetPrivateRegistriesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}`, {
      params,
    });
  }
}
