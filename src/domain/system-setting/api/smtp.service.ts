import type {
  CreateSmtpRequestPayload,
  UpdateSmtpRequestPayload,
} from "@/domain/system-setting/schemas/smtp.schema";
import { AxiosService } from "@/shared/api/axios";

export class SmtpService extends AxiosService {
  private readonly BASE_URL = "/api/v1/smtp";

  /** SMTP 설정 조회 */
  public getSmtp() {
    return this.getAxios().get(this.BASE_URL);
  }

  /** SMTP 설정 생성 */
  public createSmtp(payload: CreateSmtpRequestPayload) {
    return this.getAxios().post(this.BASE_URL, payload);
  }

  /** SMTP 설정 수정 */
  public updateSmtp(payload: UpdateSmtpRequestPayload) {
    return this.getAxios().patch(this.BASE_URL, payload);
  }

  /** SMTP 설정 삭제 */
  public deleteSmtp(id: number) {
    return this.getAxios().delete(`${this.BASE_URL}/${id}`);
  }
}
