import type {
  DeleteAdminPrivateRegistryImagePayload,
  GetAdminPrivateRegistryImagePayload,
  GetAdminPrivateRegistryImagesPayload,
  GetAdminPrivateRegistryImageTagsPayload,
} from "@/domain/private-registry-image/types/private-registry-image.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class AdminPrivateRegistryImageService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/admin/private-registry-image";

  /** 목록 조회 */
  public getList(payload: GetAdminPrivateRegistryImagesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}`, {
      params,
    });
  }

  /** 상세 조회 */
  public getDetail(payload: GetAdminPrivateRegistryImagePayload) {
    return this.getAxios().get(
      `${this.BASE_URL}/${payload.registryName}/${payload.imageId}`,
    );
  }

  /** 태그 목록 조회 */
  public getTagList(payload: GetAdminPrivateRegistryImageTagsPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(
      `${this.BASE_URL}/${payload.registryName}/${payload.imageId}/tag`,
      {
        params,
      },
    );
  }

  /** 삭제 */
  public deleteImage(payload: DeleteAdminPrivateRegistryImagePayload) {
    return this.getAxios().delete(
      `${this.BASE_URL}/${payload.registryName}/${payload.imageId}`,
    );
  }
}
