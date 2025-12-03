import type {
  GetRegistrySecurityTagDetailPayload,
  GetRegistrySecurityVulnerabilityInfoPayload,
  GetRegistrySecurityVulnerabilityListPayload,
  UpdateSecurityLevelSettingPayload,
} from "@/domain/security/types/registry-security.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class RegistrySecurityService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/internal-registry-image";

  /** 태그 상세 조회 */
  public getTagDetail(payload: GetRegistrySecurityTagDetailPayload) {
    return this.getAxios().get(
      `${this.BASE_URL}/${payload.imageId}/tag/${payload.tagId}`,
    );
  }

  /** 취약점 목록 조회 */
  public getTagVulnerabilityList(
    payload: GetRegistrySecurityVulnerabilityListPayload,
  ) {
    const { imageId, tagId, ...rest } = payload;
    const params = payloadToParams(rest);

    return this.getAxios().get(
      `${this.BASE_URL}/${imageId}/tag/${tagId}/vulnerability`,
      {
        params,
      },
    );
  }

  /** 취약점 상세 정보 조회 */
  public getVulnerabilityInfo(
    payload: GetRegistrySecurityVulnerabilityInfoPayload,
  ) {
    return this.getAxios().get(
      `${this.BASE_URL}/${payload.imageId}/tag/${payload.tagId}/vulnerability/${payload.vulnerabilityId}`,
    );
  }

  /** 보안 레벨 설정 업데이트 */
  public updateSecurityLevelSetting(
    payload: UpdateSecurityLevelSettingPayload,
  ) {
    return this.getAxios().put(
      `${this.BASE_URL}/security-level-setting`,
      payload,
    );
  }
}
