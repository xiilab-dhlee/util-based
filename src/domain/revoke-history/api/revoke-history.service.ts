import type {
  RevokeCriteriaResponseType,
  RevokeHistoryItemResponseType,
} from "@/domain/revoke-history/schemas/revoke-history.schema";
import type {
  GetRevokeHistoriesPayload,
  GetRevokeHistoryDetailPayload,
  RevokeHistoryDetailListResponse,
} from "@/domain/revoke-history/types/revoke-history.type";
import { AxiosService } from "@/shared/api/axios";
import type { CoreListResponse } from "@/shared/types/core.model";
import { payloadToParams } from "@/shared/utils/service.util";

/**
 * 리소스 회수 이력 서비스
 */
export class RevokeHistoryService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/admin/revoke-history";

  private readonly CRITERIA_URL = "/core-api/v1/core/admin/revoke";

  /** 목록 조회 */
  public getList(payload: GetRevokeHistoriesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get<CoreListResponse<RevokeHistoryItemResponseType>>(
      this.BASE_URL,
      {
        params,
      },
    );
  }

  /** 상세 조회 (경고/회수 목록 포함) */
  public getDetail(id: string, payload?: GetRevokeHistoryDetailPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get<RevokeHistoryDetailListResponse>(
      `${this.BASE_URL}/${id}`,
      {
        params,
      },
    );
  }

  /** 리소스 회수 기준 조회 */
  public getCriteria() {
    return this.getAxios().get<RevokeCriteriaResponseType>(
      `${this.CRITERIA_URL}/criteria`,
    );
  }
}
