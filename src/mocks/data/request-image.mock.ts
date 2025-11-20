import { requestImageListSchema } from "@/domain/request-image/schemas/request-image.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 이미지 요청 목록 모킹 데이터
 */
export const requestImageListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(requestImageListSchema),
);
