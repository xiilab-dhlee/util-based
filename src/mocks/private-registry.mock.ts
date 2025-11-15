import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { privateRegistryListSchema } from "@/schemas/private-registry.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 내부 레지스트리 목록 Mock 데이터
 */
export const privateRegistryListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(privateRegistryListSchema),
);
