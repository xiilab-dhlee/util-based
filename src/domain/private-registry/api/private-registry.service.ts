import type { GetPrivateRegistriesPayload } from "@/domain/private-registry/types/private-registry.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

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
