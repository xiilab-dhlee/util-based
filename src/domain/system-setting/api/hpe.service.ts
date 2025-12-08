import type { AxiosResponse } from "axios";

import type {
  HpeDetailType,
  UpdateHpeRequestType,
} from "@/domain/system-setting/schemas/hpe.schema";
import { AxiosService } from "@/shared/api/axios";

/**
 * HPE API 서비스
 * HPE OneView 연동 정보 조회 및 업데이트 기능 제공
 */
export class HpeService extends AxiosService {
  private readonly BASE_URL = "/api/v1/system-settings/hpe";

  /**
   * HPE 연동 정보 조회
   * @returns HPE 연동 정보 (연동되지 않은 경우 null)
   */
  public getHpe(): Promise<AxiosResponse<HpeDetailType | null>> {
    return this.getAxios().get<HpeDetailType | null>(this.BASE_URL);
  }

  /**
   * HPE 연동/수정
   * @param payload HPE 연동 정보 (id, password, serverIp)
   * @returns 업데이트된 HPE 정보
   */
  public updateHpe(
    payload: UpdateHpeRequestType,
  ): Promise<AxiosResponse<HpeDetailType>> {
    return this.getAxios().put<HpeDetailType>(this.BASE_URL, payload);
  }
}
