import { groupListSchema } from "@/schemas/group.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 그룹 목록 모킹 데이터
 */
export const groupListMock = Array.from({ length: 100 }, () =>
  makeMock(groupListSchema),
);
