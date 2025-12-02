import { AxiosService } from "@/shared/api/axios";

export class GpuService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/gpu";

  /** 목록 조회 */
  public getList() {
    return this.getAxios().get(`${this.BASE_URL}`);
  }

  /** 노드 조회 */
  public getNodeList() {
    return this.getAxios().get(`${this.BASE_URL}/nodes`);
  }

  /** 프로파일 조회 */
  public getProfileList() {
    return this.getAxios().get(`${this.BASE_URL}/profiles`);
  }
}
