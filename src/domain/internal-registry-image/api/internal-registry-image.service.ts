import type {
  GetInternalRegistryImagesPayload,
  GetInternalRegistryImageTagDetailPayload,
  GetInternalRegistryImageTagsPayload,
  GetInternalRegistryImageVulnerabilityListPayload,
  UpdateInternalRegistryImagePayload,
} from "@/domain/internal-registry-image/types/internal-registry-image.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class InternalRegistryImageService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/internal-registry-image";

  /** 목록 조회 */
  public getList(payload: GetInternalRegistryImagesPayload) {
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
  public getTagList(payload: GetInternalRegistryImageTagsPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}/${payload.imageId}/tag`, {
      params,
    });
  }

  /** 태그 상세 조회 */
  public getTagDetail(payload: GetInternalRegistryImageTagDetailPayload) {
    return this.getAxios().get(
      `${this.BASE_URL}/${payload.imageId}/tag/${payload.tagId}`,
    );
  }

  /** 수정 */
  public updateImage(payload: UpdateInternalRegistryImagePayload) {
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

  /** 취약점 목록 조회 */
  public getTagVulnerabilityList(
    payload: GetInternalRegistryImageVulnerabilityListPayload,
  ) {
    const params = payloadToParams(payload);

    return this.getAxios().get(
      `${this.BASE_URL}/${payload.imageId}/tag/${payload.tagId}/vulnerability`,
      {
        params,
      },
    );
  }
}
