import { credentialListResponseSchema } from "@/domain/credential/schemas/credential.schema";
import { CREDENTIAL_LIST_PAGE_SIZE } from "@/domain/system-setting/constants/system-setting.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 크레덴셜 목록 Mock 데이터
 */

/**
 * 크레덴셜 목록 Mock 데이터
 */
export const credentialListMock = Array.from(
  { length: CREDENTIAL_LIST_PAGE_SIZE },
  () => makeMock(credentialListResponseSchema),
);
