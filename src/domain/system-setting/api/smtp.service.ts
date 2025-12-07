import type { AxiosResponse } from "axios";

import type {
  CreateSmtpRequestPayload,
  SmtpIdType,
  SmtpResponse,
  UpdateSmtpRequestPayload,
} from "@/domain/system-setting/schemas/smtp.schema";
import { AxiosService } from "@/shared/api/axios";

export class SmtpService extends AxiosService {
  private readonly BASE_URL = "/api/v1/smtp";

  /** SMTP 설정 조회 */
  public getSmtp(): Promise<AxiosResponse<SmtpResponse>> {
    return this.getAxios().get<SmtpResponse>(this.BASE_URL);
  }

  /** SMTP 설정 생성 */
  public createSmtp(
    payload: CreateSmtpRequestPayload,
  ): Promise<AxiosResponse<SmtpResponse>> {
    return this.getAxios().post<SmtpResponse>(this.BASE_URL, payload);
  }

  /** SMTP 설정 수정 */
  public updateSmtp(
    payload: UpdateSmtpRequestPayload,
  ): Promise<AxiosResponse<SmtpResponse>> {
    return this.getAxios().patch<SmtpResponse>(this.BASE_URL, payload);
  }

  /** SMTP 설정 삭제 */
  public deleteSmtp(id: SmtpIdType): Promise<AxiosResponse<void>> {
    return this.getAxios().delete<void>(`${this.BASE_URL}/${id}`);
  }
}
