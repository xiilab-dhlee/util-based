import { AxiosService } from "@/services/common/axios";
import type {
  CheckPasswordPayload,
  GetPendingUsersPayload,
  GetUsersPayload,
  UpdateUserPayload,
} from "@/types/user/user.type";
import { payloadToParams } from "@/utils/common/service.util";

export class UserService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/user";

  /** 목록 조회 */
  public getList(payload: GetUsersPayload) {
    const params = payloadToParams(payload);
    return this.getAxios().get(`${this.BASE_URL}`, { params });
  }

  /** 비밀번호 재확인 */
  public async checkPassword(payload: CheckPasswordPayload) {
    return this.getAxios().post(`${this.BASE_URL}`, payload);
  }

  /** 사용자 정보 수정 */
  public async updateUser(payload: UpdateUserPayload) {
    return this.getAxios().post(`${this.BASE_URL}/${payload.id}`, payload);
  }

  /** 사용자 삭제 */
  public deleteUser(users: string[]) {
    return Promise.all(
      users.map((user) => this.getAxios().delete(`${this.BASE_URL}/${user}`)),
    );
  }

  /** 가입 승인 목록 조회 */
  public getPendingList(payload: GetPendingUsersPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}/pending`, { params });
  }
}
