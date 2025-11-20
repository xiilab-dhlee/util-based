import type { GetStoragesPayload } from "@/domain/storage/types/storage.interface";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class StorageService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/storage";

  /** 목록 조회 */
  public async getList(payload: GetStoragesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}`, { params });
  }
}
