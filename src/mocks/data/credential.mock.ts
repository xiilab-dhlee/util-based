import { credentialListSchema } from "@/domain/credential/schemas/credential.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 크레덴셜 목록 모킹 데이터
 */
export const credentialListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(credentialListSchema),
);
