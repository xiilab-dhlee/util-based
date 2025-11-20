import type { GetHubsPayload } from "@/domain/hub/types/hub.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

/**
 * 허브 서비스 클래스
 * 허브 관련 API 요청을 처리하는 서비스입니다.
 */
export class HubService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/hubs";

  /**
   * 허브 목록 조회
   */
  public getList(payload: GetHubsPayload) {
    const params = payloadToParams(payload);
    return this.getAxios().get(`${this.BASE_URL}`, { params });
  }

  /** 상세 조회 */
  public getDetail(id: number) {
    return this.getAxios().get(`${this.BASE_URL}/${id}`);
  }

  /** README 조회 */
  public getReadme(id: number) {
    return this.getAxios().get(`${this.BASE_URL}/${id}/readme`);
  }
}
