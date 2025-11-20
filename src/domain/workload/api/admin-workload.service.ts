import type {
  GetWorkloadPayload,
  GetWorkloadsPayload,
  UpdateWorkloadPayload,
} from "@/domain/workload/types/workload.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class AdminWorkloadService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/admin/workload";

  /** 목록 조회 */
  public getList(payload: GetWorkloadsPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}`, {
      params,
    });
  }

  /** 상세 조회 */
  public getDetail(payload: GetWorkloadPayload) {
    return this.getAxios().get(`${this.BASE_URL}/${payload.workloadId}`);
  }

  /** 워크로드 수정 */
  public updateWorkload(payload: UpdateWorkloadPayload) {
    return this.getAxios().put(this.BASE_URL, payload);
  }
}
