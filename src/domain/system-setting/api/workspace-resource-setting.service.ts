import type {
  WorkspaceResourceSettingRequestType,
  WorkspaceResourceSettingResponseType,
} from "@/domain/system-setting/schemas/workspace-resource-setting.schema";
import { AxiosService } from "@/shared/api/axios";

/**
 * 워크스페이스 리소스 설정 서비스
 */
export class WorkspaceResourceSettingService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/system-settings";

  /**
   * 워크스페이스 리소스 설정 업데이트
   */
  async updateWorkspaceResourceSetting(
    payload: WorkspaceResourceSettingRequestType,
  ): Promise<WorkspaceResourceSettingResponseType> {
    const response =
      await this.getAxios().put<WorkspaceResourceSettingResponseType>(
        `${this.BASE_URL}/workspace-resources`,
        payload,
      );
    return response.data;
  }
}
