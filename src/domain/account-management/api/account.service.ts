import type {
  CheckPasswordPayload,
  GetAccountsPayload,
  GetPendingAccountsPayload,
  UpdateAccountPayload,
} from "@/domain/account-management/types/account.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class AccountService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/account";

  /** 목록 조회 */
  public getList(payload: GetAccountsPayload) {
    const params = payloadToParams(payload);
    return this.getAxios().get(`${this.BASE_URL}`, { params });
  }

  /** 비밀번호 재확인 */
  public async checkPassword(payload: CheckPasswordPayload) {
    return this.getAxios().post(`${this.BASE_URL}`, payload);
  }

  /** 사용자 정보 수정 */
  public async updateAccount(payload: UpdateAccountPayload) {
    return this.getAxios().post(`${this.BASE_URL}/${payload.id}`, payload);
  }

  /** 사용자 삭제 */
  public deleteAccount(accounts: string[]) {
    return Promise.all(
      accounts.map((account) =>
        this.getAxios().delete(`${this.BASE_URL}/${account}`),
      ),
    );
  }

  /** 가입 승인 목록 조회 */
  public getPendingList(payload: GetPendingAccountsPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}/pending`, { params });
  }
}
