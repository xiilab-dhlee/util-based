import { credentialListResponseSchema } from "@/domain/credential/schemas/credential.schema";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 크레덴셜 목록 Mock 데이터
 */
export const credentialListMock = Array.from({ length: 20 }, () =>
  makeMock(credentialListResponseSchema),
);
