import type {
  DeleteAdminInternalRegistryImagePayload,
  GetAdminInternalRegistryImagePayload,
  GetAdminInternalRegistryImagesPayload,
  GetAdminInternalRegistryImageTagsPayload,
} from "@/domain/internal-registry-image/types/internal-registry-image.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class AdminInternalRegistryImageService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/admin/internal-registry-image";

  /** 목록 조회 */
  public getList(payload: GetAdminInternalRegistryImagesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}`, {
      params,
    });
  }

  /** 상세 조회 */
  public getDetail(payload: GetAdminInternalRegistryImagePayload) {
    return this.getAxios().get(
      `${this.BASE_URL}/${payload.registryName}/${payload.imageId}`,
    );
  }

  /** 태그 목록 조회 */
  public getTagList(payload: GetAdminInternalRegistryImageTagsPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(
      `${this.BASE_URL}/${payload.registryName}/${payload.imageId}/tag`,
      {
        params,
      },
    );
  }

  /** 삭제 */
  public deleteImage(payload: DeleteAdminInternalRegistryImagePayload) {
    return this.getAxios().delete(
      `${this.BASE_URL}/${payload.registryName}/${payload.imageId}`,
    );
  }
}
