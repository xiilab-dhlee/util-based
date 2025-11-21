import type {
  CreateBmcPayload,
  UpdateBmcPayload,
} from "@/domain/node/types/redfish.type";
import { AxiosService } from "@/shared/api/axios";

export class RedfishBmcService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/redfish";

  /** BMC 단일 조회 */
  public async getBmc(nodeIp: string) {
    const encodeNodeIp = encodeURIComponent(nodeIp as string);
    return this.getAxios().get(`${this.BASE_URL}/bmc/${encodeNodeIp}`);
  }

  /** BMC 등록 */
  public createBmc(payload: CreateBmcPayload) {
    return this.getAxios().post(`${this.BASE_URL}/bmc`, payload);
  }

  /** 수정 */
  public updateBmc({ id, ...other }: UpdateBmcPayload) {
    return this.getAxios().patch(`${this.BASE_URL}/bmc/${id}`, other);
  }
}
