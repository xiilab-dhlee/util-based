import userListConstants from "@/constants/user/user-list.constant";
import { userListSchema } from "@/schemas/user.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 사용자 목록 모킹 데이터
 */
export const userListMock = Array.from(
  { length: userListConstants.pageSize },
  () => makeMock(userListSchema),
);
