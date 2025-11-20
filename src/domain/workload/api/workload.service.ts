import type {
  CreateCommitImagePayload,
  GetWorkloadFilesPayload,
  GetWorkloadPayload,
  GetWorkloadsPayload,
  GetWorkloadVulnerabilitiesPayload,
  UpdateWorkloadPayload,
} from "@/domain/workload/types/workload.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class WorkloadService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/workload";

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

  /** 파일 목록 조회 */
  public getFileList({ workloadId, ...payload }: GetWorkloadFilesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}/${workloadId}/files/list`, {
      params,
    });
  }

  /** 보안 취약점 목록 조회 */
  public async getVulnerabilities(payload: GetWorkloadVulnerabilitiesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}/vulnerabilities`, {
      params,
    });
  }

  /** 워크로드 커밋 이미지 생성 */
  public async createCommitImage(payload: CreateCommitImagePayload) {
    const response = await this.getAxios().post(this.BASE_URL, payload);
    return response.data;
  }

  /** 워크로드 수정 */
  public async updateWorkload(payload: UpdateWorkloadPayload) {
    const response = await this.getAxios().put(this.BASE_URL, payload);
    return response.data;
  }
}
