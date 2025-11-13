import privateRegistryImageDetailConstants from "@/constants/registry/private-registry-image-detail.constant";
import privateRegistryListConstants from "@/constants/registry/private-registry-list.constant";
import securityConstants from "@/constants/security/security.constant";
import { AxiosService } from "@/services/common/axios";
import type {
  DeletePrivateRegistryImagePayload,
  GetPrivateRegistriesPayload,
  GetPrivateRegistryImagePayload,
  GetPrivateRegistryImagesPayload,
  GetPrivateRegistryImageTagsPayload,
  GetPrivateRegistryImageTagVulnerabilityListPayload,
} from "@/types/registry/registry.interface";
import { payloadToParams } from "@/utils/common/service.util";

export class PrivateRegistryService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/registry";

  /** 내부 레지스트리 목록 조회 */
  public async getPrivateRegistryList(payload: GetPrivateRegistriesPayload) {
    const params = payloadToParams(payload);

    return {
      content: privateRegistryListConstants.listDemo,
      total: 100,
      params,
    };
  }

  /** 내부 레지스트리 내 이미지 목록 조회 */
  public async getPrivateRegistryImageList(
    payload: GetPrivateRegistryImagesPayload,
  ) {
    const params = payloadToParams(payload);
    return {
      content: privateRegistryListConstants.listItemDemo,
      total: 100,
      params,
    };
  }

  /** 내부 레지스트리 내 이미지 상세 조회 */
  public async getPrivateRegistryImageDetail(
    payload: GetPrivateRegistryImagePayload,
  ) {
    return {
      image: privateRegistryImageDetailConstants.demoRegistryImage,
      payload,
    };
  }

  /** 내부 레지스트리 내 이미지 태그 목록 조회 */
  public async getPrivateRegistryImageTags(
    payload: GetPrivateRegistryImageTagsPayload,
  ) {
    const params = payloadToParams(payload);

    return {
      content: privateRegistryImageDetailConstants.tagListDemo,
      total: 100,
      params,
    };
  }

  /** 내부 레지스트리 내 이미지 태그 취약점 목록 조회 */
  public async getPrivateRegistryImageTagVulnerabilities(
    payload: GetPrivateRegistryImageTagVulnerabilityListPayload,
  ) {
    const params = payloadToParams(payload);
    return {
      content: securityConstants.vulnerabilityDemo,
      total: 100,
      params,
    };
  }

  /** 내부 레지스트리 내 이미지 삭제 */
  public deletePrivateRegistryImage(
    payload: DeletePrivateRegistryImagePayload,
  ) {
    return this.getAxios().delete(`${this.BASE_URL}`, {
      data: payload,
    });
  }
}
