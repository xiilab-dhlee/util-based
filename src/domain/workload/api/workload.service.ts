import type {
  CreateCommitImagePayload,
  CreateWorkloadFolderPayload,
  CreateWorkloadPayload,
  DeleteWorkloadPayload,
  GetWorkloadFilesPayload,
  GetWorkloadPayload,
  GetWorkloadsPayload,
  GetWorkloadVulnerabilitiesPayload,
  RestartWorkloadPayload,
  StopWorkloadPayload,
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

  /** 활성화 워크로드 목록 조회 */
  public getActiveList(payload: GetWorkloadsPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}/active`, {
      params,
    });
  }

  /** 비활성화 워크로드 목록 조회 */
  public getDisabledList(payload: GetWorkloadsPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}/disabled`, {
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
    const response = await this.getAxios().post(
      "/core-api/v1/core/internal-registry-image",
      payload,
    );
    return response.data;
  }

  /** 워크로드 생성 */
  public async createWorkload(payload: CreateWorkloadPayload) {
    const response = await this.getAxios().post(this.BASE_URL, payload);
    return response.data;
  }

  /** 워크로드 수정 */
  public async updateWorkload(payload: UpdateWorkloadPayload) {
    const response = await this.getAxios().put(this.BASE_URL, payload);
    return response.data;
  }

  /** 워크로드 삭제 */
  public async deleteWorkload(payload: DeleteWorkloadPayload) {
    const response = await this.getAxios().delete(this.BASE_URL, {
      data: payload,
    });
    return response.data;
  }

  /** 워크로드 종료 */
  public async stopWorkload(payload: StopWorkloadPayload) {
    const response = await this.getAxios().post(
      `${this.BASE_URL}/stop`,
      payload,
    );
    return response.data;
  }

  /** 워크로드 재시작 */
  public async restartWorkload(payload: RestartWorkloadPayload) {
    const response = await this.getAxios().post(
      `${this.BASE_URL}/restart`,
      payload,
    );
    return response.data;
  }

  /** 워크로드 폴더 추가 */
  public async createWorkloadFolder(payload: CreateWorkloadFolderPayload) {
    const response = await this.getAxios().post(
      `${this.BASE_URL}/${payload.workloadId}/directory`,
      payload,
    );
    return response.data;
  }
}
