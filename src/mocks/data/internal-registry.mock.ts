import { internalregistryListSchema } from "@/domain/internal-registry/schemas/internal-registry.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 내부 레지스트리 목록 Mock 데이터
 */
export const internalregistryListMock = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(internalregistryListSchema),
);
