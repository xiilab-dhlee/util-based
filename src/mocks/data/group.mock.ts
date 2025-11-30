import { groupListResponseSchema } from "@/domain/group/schemas/group.schema";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 그룹 목록 모킹 데이터
 */
export const groupListMock = Array.from({ length: 100 }, () =>
  makeMock(groupListResponseSchema),
);
