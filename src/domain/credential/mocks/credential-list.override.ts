import {
  type CredentialListItemResponse,
  CredentialListItemResponseCredentialType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetCredentialsMockHandler,
  getGetCredentialsResponseMock,
} from "@/api/generated/credential/credential.msw";

/**
 * 크리덴셜 이름 생성
 * keyword가 있으면 해당 키워드를 포함한 이름 생성
 */
function generateCredentialName(index: number, keyword: string): string {
  const prefix = keyword || "credential";
  return `${prefix}-${index + 1}`;
}

export const credentialListOverrideHandlers = [
  // 크리덴셜 목록 조회 (pageSize에 맞는 개수, keyword 지원)
  getGetCredentialsMockHandler(async (info) => {
    // URL에서 query params 추출
    const url = new URL(info.request.url);
    const keyword = url.searchParams.get("keyword") || "";
    const pageNo = parseInt(url.searchParams.get("pageNo") || "0", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

    const { status, message, timestamp } = getGetCredentialsResponseMock();

    // pageSize에 맞는 content 생성
    const content: CredentialListItemResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index;

        return {
          credentialId: globalIndex + 1,
          credentialType:
            index % 2 === 0
              ? CredentialListItemResponseCredentialType.IMAGE_REGISTRY
              : CredentialListItemResponseCredentialType.GIT_REPOSITORY,
          credentialName: generateCredentialName(globalIndex, keyword),
          description: `크리덴셜 설명 ${globalIndex + 1}`,
          createDateTime: new Date(
            Date.now() - globalIndex * 24 * 60 * 60 * 1000,
          ).toISOString(),
          creatorName: `사용자 ${(globalIndex % 5) + 1}`,
          creatorId: `user-${(globalIndex % 5) + 1}`,
        };
      },
    );

    // 총 데이터 개수
    const totalSize = pageSize * 3;

    return {
      status,
      message,
      timestamp,
      data: {
        totalSize,
        totalPageNum: Math.ceil(totalSize / pageSize),
        currentPageNo: pageNo,
        content,
      },
    };
  }),
];
