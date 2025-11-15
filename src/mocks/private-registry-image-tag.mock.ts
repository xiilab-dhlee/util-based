import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { privateRegistryImageTagListSchema } from "@/schemas/private-registry-image-tag.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 내부 레지스트리 이미지 태그 목록 Mock 데이터
 */
export const privateRegistryImageTagListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(privateRegistryImageTagListSchema),
);
