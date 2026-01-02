import {
  type WorkspaceMemberListType,
  workspaceMemberListSchema,
} from "@/domain/workspace-member/schemas/workspace-member.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/** 워크스페이스 멤버 mock 생성 옵션 타입 */
type WorkspaceMemberMockOptions = Partial<WorkspaceMemberListType> & {
  size?: number;
  searchText?: string;
};

/**
 * 워크스페이스 멤버 목록 mock 생성 함수
 * - searchText가 전달되면 name에 해당 텍스트가 포함됨
 */
export function createWorkspaceMemberListMock(
  override?: WorkspaceMemberMockOptions,
): WorkspaceMemberListType[] {
  const { size = LIST_PAGE_SIZE, searchText, ...restOverride } = override ?? {};

  return Array.from({ length: size }, (_, index) => {
    const baseOverride: Partial<WorkspaceMemberListType> = {
      ...restOverride,
    };

    // searchText가 있으면 name에 포함
    if (searchText) {
      baseOverride.name = `${searchText}-member-${index + 1}`;
    }

    return makeMock(workspaceMemberListSchema, baseOverride);
  });
}
