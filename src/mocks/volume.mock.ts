import volumeListConstants from "@/constants/volume/volume-list.constant";
import { volumeDetailSchema, volumeListSchema } from "@/schemas/volume.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 볼륨 목록 Mock 데이터
 */
export const volumeListMock = Array.from(
  { length: volumeListConstants.pageSize },
  () => makeMock(volumeListSchema),
);

/**
 * 볼륨 상세 Mock 데이터
 */
export const volumeDetailMock = makeMock(volumeDetailSchema);
