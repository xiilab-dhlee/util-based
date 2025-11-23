import type { GetInternalRegistriesPayload } from "@/domain/internal-registry/types/internal-registry.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class InternalRegistryService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/internal-registry";

  /** 내부 레지스트리 목록 조회 */
  public async getList(payload: GetInternalRegistriesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}`, {
      params,
    });
  }
}
