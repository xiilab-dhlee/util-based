import nodeDetailConstants from "@/constants/node/node-detail.constant";
import { AxiosService } from "@/services/common/axios";
import type {
  GetNodesPayload,
  UpdateMigPayload,
  UpdateMpsPayload,
  UpdateNodeSchedulingPayload,
} from "@/types/node/node.interface";
import { payloadToParams } from "@/utils/common/service.util";

export class NodeService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/nodes";

  /** 목록 조회 */
  public getList(payload: GetNodesPayload) {
    const params = payloadToParams(payload);
    return this.getAxios().get(`${this.BASE_URL}`, { params });
  }

  /** 상세 조회 */
  public async getDetail(nodeName: string) {
    if (process.env.NEXT_PUBLIC_DEMO_ENABLE === "Y") {
      return { node: nodeDetailConstants.demoNode };
    } else {
      return this.getAxios().get(`${this.BASE_URL}/${nodeName}`);
    }
  }

  /** 노드 자원 상세 조회 */
  public async getResources(nodeName: string) {
    if (process.env.NEXT_PUBLIC_DEMO_ENABLE === "Y") {
      return { resources: nodeDetailConstants.demoResources };
    } else {
      return this.getAxios().get(`${this.BASE_URL}/${nodeName}/resources`);
    }
  }

  /** MPS 설정 조회 */
  public getMpsInfo(nodeName: string) {
    return this.getAxios().get(`${this.BASE_URL}/${nodeName}/mps`);
  }

  /** MIG 설정 조회 */
  public async getMigInfo(nodeName: string) {
    return this.getAxios().get(`${this.BASE_URL}/${nodeName}/mig`);
  }

  /** MPS 설정 */
  public updateMps({ nodeName, ...payload }: UpdateMpsPayload) {
    return this.getAxios().post(`${this.BASE_URL}/${nodeName}/mps`, payload);
  }

  /** MIG 설정 */
  public updateMig(payload: UpdateMigPayload) {
    return this.getAxios().patch(`${this.BASE_URL}/mig`, payload);
  }

  /** 스케쥴링 설정 */
  public updateScheduling({
    nodeName,
    ...payload
  }: UpdateNodeSchedulingPayload) {
    return this.getAxios().post(
      `${this.BASE_URL}/${nodeName}/schedule`,
      payload,
    );
  }
}
