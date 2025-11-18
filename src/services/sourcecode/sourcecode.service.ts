import type { SourcecodeIdType } from "@/schemas/sourcecode.schema";
import { AxiosService } from "@/services/common/axios";
import type {
  CreateSourcecodePayload,
  GetSourcecodesPayload,
  UpdateSourcecodePayload,
} from "@/types/sourcecode/sourcecode.type";
import { payloadToParams } from "@/utils/common/service.util";

export class SourcecodeService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/sourcecode";

  /** 목록 조회 */
  public getList(payload: GetSourcecodesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}`, {
      params,
    });
  }

  /** 상세 조회 */
  public getDetail(id: number) {
    return this.getAxios().get(`${this.BASE_URL}/${id}`);
  }

  /** 소스코드 생성 */
  public createSourcecode(payload: CreateSourcecodePayload) {
    return this.getAxios().post(this.BASE_URL, payload);
  }

  /** 소스코드 수정 */
  public updateSourcecode(payload: UpdateSourcecodePayload) {
    return this.getAxios().patch(this.BASE_URL, payload);
  }

  /** 소스코드 삭제 */
  public deleteSourcecode(sourcecodes: SourcecodeIdType[]) {
    return Promise.all(
      sourcecodes.map((sourcecode) =>
        this.getAxios().delete(`${this.BASE_URL}/${sourcecode}`),
      ),
    );
  }
}
