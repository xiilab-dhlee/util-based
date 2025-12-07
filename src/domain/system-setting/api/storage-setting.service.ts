import type {
  CreateStorageSettingRequestPayload,
  StorageSettingIdType,
  UpdateStorageSettingRequestPayload,
} from "@/domain/system-setting/schemas/storage-setting.schema";
import { AxiosService } from "@/shared/api/axios";
import type { CorePayload } from "@/shared/types/api.interface";
import { payloadToParams } from "@/shared/utils/service.util";

interface GetStorageSettingsPayload extends CorePayload {
  page: number;
  size: number;
}

export class StorageSettingService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/setting/storage";

  /** 스토리지 설정 목록 조회 */
  public getList(payload: GetStorageSettingsPayload) {
    const params = payloadToParams(payload);
    return this.getAxios().get(`${this.BASE_URL}`, { params });
  }
  /** 스토리지 설정 상세 조회 */
  public getDetail(id: StorageSettingIdType) {
    return this.getAxios().get(`${this.BASE_URL}/${id}`);
  }

  /** 스토리지 설정 생성 */
  public create(payload: CreateStorageSettingRequestPayload) {
    return this.getAxios().post(this.BASE_URL, payload);
  }

  /** 스토리지 설정 수정 */
  public update(payload: UpdateStorageSettingRequestPayload) {
    return this.getAxios().patch(this.BASE_URL, payload);
  }

  /** 스토리지 설정 삭제 */
  public delete(id: StorageSettingIdType) {
    return this.getAxios().delete(`${this.BASE_URL}/${id}`);
  }
}
