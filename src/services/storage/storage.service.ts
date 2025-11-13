import storageListConstants from "@/constants/storage/storage-list.constant";
import { AxiosService } from "@/services/common/axios";
import type { GetStoragesPayload } from "@/types/storage/storage.interface";
import { payloadToParams } from "@/utils/common/service.util";

export class StorageService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/storage";

  /** 목록 조회 */
  public async getList(payload: GetStoragesPayload) {
    const params = payloadToParams(payload);

    return { storages: storageListConstants.listDemo, total: 100, params };
  }
}

