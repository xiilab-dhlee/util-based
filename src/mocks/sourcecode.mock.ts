import sourcecodeListConstants from "@/constants/sourcecode/sourcecode-list.constant";
import {
  sourcecodeDetailSchema,
  sourcecodeListSchema,
} from "@/schemas/sourcecode.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 소스코드 목록 Mock 데이터
 */
export const sourcecodeListMock = Array.from(
  { length: sourcecodeListConstants.pageSize },
  () => makeMock(sourcecodeListSchema),
);

/**
 * 소스코드 상세 Mock 데이터
 */
export const sourcecodeDetailMock = makeMock(sourcecodeDetailSchema);
