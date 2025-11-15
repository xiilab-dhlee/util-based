import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import {
  privateRegistryImageDetailSchema,
  privateRegistryImageListSchema,
} from "@/schemas/private-registry-image.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 내부 레지스트리 이미지 목록 Mock 데이터
 */
export const privateRegistryImageListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(privateRegistryImageListSchema),
);

/**
 * 내부 레지스트리 이미지 상세 Mock 데이터
 */
export const privateRegistryImageDetailMock = makeMock(
  privateRegistryImageDetailSchema,
);
