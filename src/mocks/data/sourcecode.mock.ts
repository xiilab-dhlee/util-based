import {
  sourcecodeDetailSchema,
  sourcecodeListSchema,
} from "@/domain/sourcecode/schemas/sourcecode.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

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
