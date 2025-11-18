import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { credentialListSchema } from "@/schemas/credential.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 크레덴셜 목록 모킹 데이터
 */
export const credentialListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(credentialListSchema),
);
