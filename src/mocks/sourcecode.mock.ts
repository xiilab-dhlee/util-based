import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import {
  sourcecodeDetailSchema,
  sourcecodeListSchema,
} from "@/schemas/sourcecode.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 소스코드 목록 Mock 데이터
 */
export const sourcecodeListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(sourcecodeListSchema),
);

/**
 * 소스코드 상세 Mock 데이터
 */
export const sourcecodeDetailMock = makeMock(sourcecodeDetailSchema);
