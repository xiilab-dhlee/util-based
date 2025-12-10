import type { AxiosResponse } from "axios";

import type {
  CreateStorageSettingRequestPayload,
  StorageSettingDetailResponse,
  StorageSettingIdType,
  StorageSettingListResponse,
  UpdateStorageSettingRequestPayload,
} from "@/domain/system-setting/schemas/storage-setting.schema";
import { AxiosService } from "@/shared/api/axios";
import type { CorePaginate, CorePayload } from "@/shared/types/api.interface";
import { payloadToParams } from "@/shared/utils/service.util";

export interface GetStorageSettingsPayload extends CorePayload, CorePaginate {}

export class StorageSettingService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/setting/storage";

  /** 스토리지 설정 목록 조회 */
  public getList(
    payload: GetStorageSettingsPayload,
  ): Promise<AxiosResponse<StorageSettingListResponse>> {
    const params = payloadToParams(payload);
    return this.getAxios().get<StorageSettingListResponse>(`${this.BASE_URL}`, {
      params,
    });
  }
  /** 스토리지 설정 상세 조회 */
  public getDetail(
    id: StorageSettingIdType,
  ): Promise<AxiosResponse<StorageSettingDetailResponse>> {
    return this.getAxios().get<StorageSettingDetailResponse>(
      `${this.BASE_URL}/${id}`,
    );
  }

  /** 스토리지 설정 생성 */
  public create(
    payload: CreateStorageSettingRequestPayload,
  ): Promise<AxiosResponse<StorageSettingDetailResponse>> {
    return this.getAxios().post<StorageSettingDetailResponse>(
      this.BASE_URL,
      payload,
    );
  }

  /** 스토리지 설정 수정 */
  public update(
    payload: UpdateStorageSettingRequestPayload,
  ): Promise<AxiosResponse<StorageSettingDetailResponse>> {
    return this.getAxios().patch<StorageSettingDetailResponse>(
      this.BASE_URL,
      payload,
    );
  }

  /** 스토리지 설정 삭제 */
  public delete(id: StorageSettingIdType): Promise<AxiosResponse<void>> {
    return this.getAxios().delete<void>(`${this.BASE_URL}/${id}`);
  }
}
