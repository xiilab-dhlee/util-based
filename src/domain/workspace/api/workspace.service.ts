import type {
  GetWorkspaceMembersPayload,
  GetWorkspaceRequestResourcesPayload,
  GetWorkspacesPayload,
  UpdateWorkspaceMemberPayload,
  UpdateWorkspacePayload,
  UpdateWorkspaceRequestResourcePayload,
} from "@/domain/workspace/types/workspace.interface";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class WorkspaceService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/workspace";

  /** 목록 조회 */
  public getList(payload: GetWorkspacesPayload) {
    const params = payloadToParams(payload);
    return this.getAxios().get(`${this.BASE_URL}`, { params });
  }

  /** 상세 조회 */
  public async getDetail(id: string) {
    return this.getAxios().get(`${this.BASE_URL}/${id}`);
  }

  /** 워크스페이스 수정 */
  public updateWorkspace(payload: UpdateWorkspacePayload) {
    return this.getAxios().put(this.BASE_URL, payload);
  }

  /** 워크스페이스 삭제 */
  public deleteWorkspace(workspaces: string[]) {
    return Promise.all(
      workspaces.map((workspace) =>
        this.getAxios().delete(`${this.BASE_URL}/${workspace}`),
      ),
    );
  }

  /** 워크스페이스 멤버 목록 조회 */
  public getMemberList(payload: GetWorkspaceMembersPayload) {
    const params = payloadToParams(payload);
    return this.getAxios().get(`${this.BASE_URL}/member`, { params });
  }

  /** 워크스페이스 멤버 수정 */
  public updateWorkspaceMember(payload: UpdateWorkspaceMemberPayload) {
    return this.getAxios().put(this.BASE_URL, payload);
  }

  /** 워크스페이스 멤버 삭제 */
  public deleteWorkspaceMember(members: string[]) {
    return Promise.all(
      members.map((member) =>
        this.getAxios().delete(`${this.BASE_URL}/member/${member}`),
      ),
    );
  }

  /** 워크스페이스 리소스 요청 목록 조회 */
  public getRequestResourceList(payload: GetWorkspaceRequestResourcesPayload) {
    const params = payloadToParams(payload);
    return this.getAxios().get(`${this.BASE_URL}/admin/resource`, {
      params,
    });
  }

  /** 워크스페이스 리소스 요청 승인/반려 */
  public updateRequestResource(payload: UpdateWorkspaceRequestResourcePayload) {
    return this.getAxios().put(
      `${this.BASE_URL}/admin/resource/${payload.id}`,
      payload,
    );
  }
}
