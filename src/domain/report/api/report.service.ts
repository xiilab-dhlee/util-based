import type { GetReportsPayload } from "@/domain/report/types/report.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class ReportService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/report";

  /** 목록 조회 */
  public getList(payload: GetReportsPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}`, {
      params,
    });
  }
}
