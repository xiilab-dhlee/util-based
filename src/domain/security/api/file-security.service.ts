import type { FileSecurityScanListQuery } from "@/domain/security/schemas/file-security-scan.schema";
import type {
  DeleteFileSecurityScanPayload,
  GetFileSecurityCriticalVulnerabilitiesPayload,
  GetFileSecurityCriticalVulnerabilitiesResponse,
  GetFileSecurityScanDetailPayload,
  GetFileSecurityScanDetailResponse,
  GetFileSecurityScanFileListPayload,
  GetFileSecurityScanFileListResponse,
  GetFileSecurityScanListResponse,
  GetFileSecurityVulnerabilityDetailListPayload,
  GetFileSecurityVulnerabilityDetailListResponse,
  GetFileSecurityVulnerabilityInfoPayload,
  GetFileSecurityVulnerabilityInfoResponse,
  UpdateSecurityLevelSettingPayload,
  UpdateSecurityScheduleSettingPayload,
} from "@/domain/security/types/file-security.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class FileSecurityService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/file-security";

  /** 파일 시스템 보안 검사 목록 조회 */
  public getScanList(payload?: FileSecurityScanListQuery) {
    const params = payload ? payloadToParams(payload) : undefined;

    return this.getAxios().get<GetFileSecurityScanListResponse>(
      `${this.BASE_URL}/scan`,
      {
        params,
      },
    );
  }

  /** 파일 시스템 보안 검사 상세 조회 */
  public getScanDetail(payload: GetFileSecurityScanDetailPayload) {
    return this.getAxios().get<GetFileSecurityScanDetailResponse>(
      `${this.BASE_URL}/scan/${payload.scanId}`,
    );
  }

  /** 파일 시스템 보안 검사 파일 목록 조회 */
  public getScanFileList(payload: GetFileSecurityScanFileListPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get<GetFileSecurityScanFileListResponse>(
      `${this.BASE_URL}/scan/${payload.scanId}/files`,
      {
        params,
      },
    );
  }

  /** 파일 시스템 보안 Critical 취약점 목록 조회 */
  public getCriticalVulnerabilities(
    payload: GetFileSecurityCriticalVulnerabilitiesPayload,
  ) {
    const params = payloadToParams(payload);

    return this.getAxios().get<GetFileSecurityCriticalVulnerabilitiesResponse>(
      `${this.BASE_URL}/vulnerabilities`,
      {
        params,
      },
    );
  }

  /** 파일 시스템 보안 파일별 취약점 목록 조회 */
  public getFileVulnerabilityList(
    payload: GetFileSecurityVulnerabilityDetailListPayload,
  ) {
    const params = payloadToParams(payload);

    return this.getAxios().get<GetFileSecurityVulnerabilityDetailListResponse>(
      `${this.BASE_URL}/scan/${payload.scanId}/files/${payload.fileId}/vulnerabilities`,
      {
        params,
      },
    );
  }

  /** 파일 시스템 보안 검사 삭제 */
  public deleteScan(payload: DeleteFileSecurityScanPayload) {
    return this.getAxios().delete(`${this.BASE_URL}/scan/${payload.scanId}`);
  }

  /** 파일 시스템 보안 검사 여러 개 삭제 */
  public deleteScans(scanIds: number[]) {
    return Promise.all(
      scanIds.map((scanId) =>
        this.getAxios().delete(`${this.BASE_URL}/scan/${scanId}`),
      ),
    );
  }

  /** 파일 시스템 보안 취약점 상세 정보 조회 */
  public getVulnerabilityInfo(
    payload: GetFileSecurityVulnerabilityInfoPayload,
  ) {
    return this.getAxios().get<GetFileSecurityVulnerabilityInfoResponse>(
      `${this.BASE_URL}/scan/${payload.scanId}/files/${payload.fileId}/vulnerabilities/${payload.vulnerabilityId}`,
    );
  }

  /** 파일 보안 레벨 설정 업데이트 */
  public updateSecurityLevelSetting(
    payload: UpdateSecurityLevelSettingPayload,
  ) {
    return this.getAxios().put(
      `${this.BASE_URL}/security-level-setting`,
      payload,
    );
  }

  /** 파일 보안 스케줄 설정 업데이트 */
  public updateSecurityScheduleSetting(
    payload: UpdateSecurityScheduleSettingPayload,
  ) {
    return this.getAxios().put(
      `${this.BASE_URL}/security-schedule-setting`,
      payload,
    );
  }
}
