import { credentialDetailResponseSchema } from "@/domain/credential/schemas/credential.schema";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 크레덴셜 상세 Mock 데이터
 */
export const credentialDetailMock = Array.from({ length: 20 }, () =>
  makeMock(credentialDetailResponseSchema),
);
