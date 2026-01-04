import {
  type CredentialListType,
  credentialDetailSchema,
  credentialListSchema,
} from "@/domain/credential/schemas/credential.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/** 크리덴셜 mock 생성 옵션 타입 */
type CredentialMockOptions = Partial<CredentialListType> & {
  size?: number;
  searchText?: string;
};

/**
 * 크리덴셜 목록 mock 생성 함수
 * - searchText가 전달되면 name에 해당 텍스트가 포함됨
 */
export function createCredentialListMock(
  override?: CredentialMockOptions,
): CredentialListType[] {
  const { size = LIST_PAGE_SIZE, searchText, ...restOverride } = override ?? {};

  return Array.from({ length: size }, (_, index) => {
    const baseOverride: Partial<CredentialListType> = {
      ...restOverride,
    };

    // searchText가 있으면 name에 포함
    if (searchText) {
      baseOverride.name = `${searchText}-credential-${index + 1}`;
    }

    return makeMock(credentialListSchema, baseOverride);
  });
}

export const credentialDetailMock = makeMock(credentialDetailSchema);
