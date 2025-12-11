import type { AxiosResponse } from "axios";

import type {
  LicenseDetailType,
  LicenseListResponseType,
  RenewLicenseRequestType,
} from "@/domain/system-setting/schemas/license.schema";
import { AxiosService } from "@/shared/api/axios";

/**
 * 라이선스 API 서비스
 * 라이선스 조회 및 갱신 기능 제공
 */
export class LicenseService extends AxiosService {
  private readonly BASE_URL = "/api/v1/license";

  /**
   * 현재 라이선스 정보 및 등록 이력 조회
   * @returns 현재 라이선스 + 이력 목록
   */
  public getLicense(): Promise<AxiosResponse<LicenseListResponseType>> {
    return this.getAxios().get<LicenseListResponseType>(this.BASE_URL);
  }

  /**
   * 라이선스 갱신 (신규 등록)
   * @param payload 라이선스 키
   * @returns 등록된 라이선스 정보
   */
  public renewLicense(
    payload: RenewLicenseRequestType,
  ): Promise<AxiosResponse<LicenseDetailType>> {
    return this.getAxios().post<LicenseDetailType>(this.BASE_URL, payload);
  }
}
