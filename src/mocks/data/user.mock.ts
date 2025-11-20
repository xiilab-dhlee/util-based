import { userListSchema } from "@/domain/user/schemas/user.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 사용자 목록 모킹 데이터
 */
export const userListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(userListSchema),
);
