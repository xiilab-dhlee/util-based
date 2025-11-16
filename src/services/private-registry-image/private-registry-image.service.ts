import { AxiosService } from "@/services/common/axios";
import type {
  GetPrivateRegistryImagesPayload,
  GetPrivateRegistryImageTagsPayload,
  UpdatePrivateRegistryImagePayload,
} from "@/types/private-registry-image/private-registry-image.type";
import { payloadToParams } from "@/utils/common/service.util";

export class PrivateRegistryImageService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/private-registry-image";

  /** 목록 조회 */
  public getList(payload: GetPrivateRegistryImagesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}`, {
      params,
    });
  }

  /** 상세 조회 */
  public getDetail(id: number) {
    return this.getAxios().get(`${this.BASE_URL}/${id}`);
  }

  /** 태그 목록 조회 */
  public getTagList(payload: GetPrivateRegistryImageTagsPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}/${payload.imageId}/tag`, {
      params,
    });
  }

  /** 수정 */
  public updateImage(payload: UpdatePrivateRegistryImagePayload) {
    return this.getAxios().put(this.BASE_URL, payload);
  }

  /** 삭제 */
  public deleteImage(images: number[]) {
    return Promise.all(
      images.map((image) =>
        this.getAxios().delete(`${this.BASE_URL}/${image}`),
      ),
    );
  }

  /** 태그 삭제 */
  public deleteImageTag(tags: number[]) {
    return Promise.all(
      tags.map((tag) => this.getAxios().delete(`${this.BASE_URL}/tag/${tag}`)),
    );
  }
}
