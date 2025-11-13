import requestImageListConstants from "@/constants/request-image/request-image-list.constant";
import { requestImageListSchema } from "@/schemas/request-image.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 이미지 요청 목록 모킹 데이터
 */
export const requestImageListMock = Array.from(
  { length: requestImageListConstants.pageSize },
  () => makeMock(requestImageListSchema),
);
