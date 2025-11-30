import { AxiosService } from "@/shared/api/axios";

export class GroupService extends AxiosService {
  private readonly BASE_URL = "/api/v1/core/group";

  /** 모든 그룹 목록 조회 */
  public getAll() {
    return this.getAxios().get(`${this.BASE_URL}`);
  }

  /** 그룹 상세 조회 */
  public getDetail(groupId: string) {
    return this.getAxios().get(`${this.BASE_URL}/${groupId}`);
  }

  /** 그룹 삭제 */
  public deleteGroup(groupId: string) {
    return this.getAxios().delete(`${this.BASE_URL}/${groupId}`);
  }
}
