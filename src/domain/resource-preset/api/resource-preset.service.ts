import type {
  ResourcePresetDetailResponseType,
  ResourcePresetListResponseType,
  ResourcePresetRequestPayload,
} from "@/domain/resource-preset/schemas/resource-preset.schema";
import type { GetResourcePresetsPayload } from "@/domain/resource-preset/types/resource-preset.type";
import { AxiosService } from "@/shared/api/axios";
import type { CoreListResponse } from "@/shared/types/core.model";
import { payloadToParams } from "@/shared/utils/service.util";

/**
 * 자원 프리셋 서비스
 */
export class ResourcePresetService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/admin/resource-preset";

  /**
   * 목록 조회
   */
  public getList(payload?: GetResourcePresetsPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get<
      CoreListResponse<ResourcePresetListResponseType>
    >(this.BASE_URL, { params });
  }

  /**
   * 상세 조회
   */
  public getDetail(id: string) {
    return this.getAxios().get<ResourcePresetDetailResponseType>(
      `${this.BASE_URL}/${id}`,
    );
  }

  /**
   * 생성
   */
  public create(payload: ResourcePresetRequestPayload) {
    return this.getAxios().post<ResourcePresetDetailResponseType>(
      this.BASE_URL,
      payload,
    );
  }

  /**
   * 수정
   */
  public update(id: string, payload: ResourcePresetRequestPayload) {
    return this.getAxios().put<ResourcePresetDetailResponseType>(
      `${this.BASE_URL}/${id}`,
      payload,
    );
  }

  /**
   * 삭제
   */
  public delete(id: string) {
    return this.getAxios().delete(`${this.BASE_URL}/${id}`);
  }
}
