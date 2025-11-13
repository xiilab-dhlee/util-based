import type { VolumeListType } from "@/schemas/volume.schema";
import { AxiosService } from "@/services/common/axios";
import type {
  CompressVolumeFilePayload,
  CreateVolumeFolderPayload,
  CreateVolumePayload,
  GetVolumeFilesPayload,
  GetVolumesPayload,
  UpdateVolumePayload,
} from "@/types/volume/volume.type";
import { payloadToParams } from "@/utils/common/service.util";

export class VolumeService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/volume";

  /** 목록 조회 */
  public getList(payload: GetVolumesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}`, {
      params,
    });
  }

  /** 상세 조회 */
  public getDetail(id: string) {
    return this.getAxios().get(`${this.BASE_URL}/${id}`);
  }

  /** 파일 목록 조회 */
  public getFileList({ id, ...payload }: GetVolumeFilesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}/${id}/files/list`, {
      params,
    });
  }

  /** 볼륨 생성 */
  public createVolume(payload: CreateVolumePayload) {
    return this.getAxios().post(this.BASE_URL, payload);
  }

  /** 볼륨 수정 */
  public updateVolume(payload: UpdateVolumePayload) {
    return this.getAxios().patch(this.BASE_URL, payload);
  }

  /** 볼륨 삭제 */
  public deleteVolume(volumes: Pick<VolumeListType, "uid">[]) {
    return Promise.all(
      volumes.map((volume) =>
        this.getAxios().delete(`${this.BASE_URL}/${volume}`),
      ),
    );
  }

  /** 볼륨 파일 압축 */
  public compressVolumeFile(payload: CompressVolumeFilePayload) {
    return this.getAxios().post(
      `${this.BASE_URL}/${payload.id}/compress`,
      payload,
    );
  }

  /** 볼륨 폴더 추가 */
  public createVolumeFolder(payload: CreateVolumeFolderPayload) {
    return this.getAxios().post(
      `${this.BASE_URL}/${payload.id}/directory`,
      payload,
    );
  }
}
