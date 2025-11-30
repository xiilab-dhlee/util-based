import { accountListResponseSchema } from "@/domain/account-management/schemas/account.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 사용자 목록 모킹 데이터
 */
export const accountListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(accountListResponseSchema),
);
