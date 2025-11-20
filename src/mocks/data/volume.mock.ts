import {
  volumeDetailSchema,
  volumeListSchema,
} from "@/domain/volume/schemas/volume.schema";
import { CARD_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 볼륨 목록 Mock 데이터
 */
export const volumeListMock = Array.from({ length: CARD_PAGE_SIZE }, () =>
  makeMock(volumeListSchema),
);

/**
 * 볼륨 상세 Mock 데이터
 */
export const volumeDetailMock = makeMock(volumeDetailSchema);
