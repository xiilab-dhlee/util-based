import { AxiosService } from "@/services/common/axios";
import type {
  GetRequestImagesPayload,
  GetWaitingRequestImagesPayload,
} from "@/types/request-image/request-image.type";
import { payloadToParams } from "@/utils/common/service.util";

export class RequestImageService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/admin/request-image";

  /** 목록 조회 */
  public getList(payload: GetRequestImagesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}`, {
      params,
    });
  }

  /** 승인 대기 목록 조회 */
  public getWaitingList(payload: GetWaitingRequestImagesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}/waiting`, {
      params,
    });
  }
}
