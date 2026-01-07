import {
  getGetAllAccountsMockHandler,
  getGetAllAccountsResponseMock,
} from "@/api/generated/admin-account/admin-account.msw";
import type {
  AccountItemResponse,
  GetAllAccountsOrder,
  GetAllAccountsSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/**
 * 정렬 가능한 accountName 생성
 * ASC: A-user-1, A-user-2, ... Z-user-26
 * DESC: Z-user-1, Z-user-2, ... A-user-26
 */
function generateAccountName(
  index: number,
  keyword: string,
  sort: GetAllAccountsSort,
  order: GetAllAccountsOrder,
): string {
  if (keyword) {
    return `${keyword}-${index + 1}`;
  }

  if (sort === "ACCOUNT_NAME") {
    // 알파벳 문자로 정렬 가능한 이름 생성
    const charCode = order === "ASC" ? 65 + (index % 26) : 90 - (index % 26); // A-Z or Z-A
    const prefix = String.fromCharCode(charCode);
    return `${prefix}-user-${index + 1}`;
  }

  return `user-${index + 1}`;
}

/**
 * 정렬 가능한 createdAt 생성
 * ASC: 오래된 날짜부터 (과거 → 현재)
 * DESC: 최신 날짜부터 (현재 → 과거)
 */
function generateCreatedAt(
  index: number,
  sort: GetAllAccountsSort,
  order: GetAllAccountsOrder,
): string {
  const baseDate = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;

  if (sort === "CREATED_AT") {
    // 정렬 순서에 맞게 날짜 생성
    const offset =
      order === "ASC"
        ? (30 - index) * dayInMs // ASC: 오래된 것부터 (30일 전 → 현재)
        : index * dayInMs; // DESC: 최신 것부터 (현재 → 과거)
    return new Date(baseDate - offset).toISOString();
  }

  // 기본: 최신순
  return new Date(baseDate - index * dayInMs).toISOString();
}

export const adminAccountListOverrideHandlers = [
  // 계정 목록 조회 (pageSize에 맞는 개수, keyword/sort/order 지원)
  getGetAllAccountsMockHandler(async (info) => {
    // URL에서 query params 추출
    const url = new URL(info.request.url);
    const keyword = url.searchParams.get("keyword") || "";
    const pageNo = parseInt(url.searchParams.get("pageNo") || "0", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const sort = (url.searchParams.get("sortRequest[sort]") ||
      "ACCOUNT_NAME") as GetAllAccountsSort;
    const order = (url.searchParams.get("sortRequest[order]") ||
      "ASC") as GetAllAccountsOrder;

    const { status, message, timestamp } = getGetAllAccountsResponseMock();

    // pageSize에 맞는 content 생성
    const content: AccountItemResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index;

        return {
          accountId: `account-${globalIndex + 1}`,
          accountName: generateAccountName(globalIndex, keyword, sort, order),
          email: `account-${globalIndex + 1}@xiilab.com`,
          createdAt: generateCreatedAt(globalIndex, sort, order),
          accountRole: (["ADMIN", "USER", "SUPER_ADMIN"] as const)[index % 3],
          workspaceCount: Math.floor(Math.random() * 10),
          workspaceLimitCount: 10,
          isEnabled: index % 3 !== 0,
          groupName: [
            `그룹-${(index % 3) + 1}`,
            `그룹-${(index % 3) + 2}`,
            `그룹-${(index % 3) + 3}`,
            `그룹-${(index % 3) + 4}`,
            `그룹-${(index % 3) + 5}`,
            `그룹-${(index % 3) + 6}`,
            `그룹-${(index % 3) + 7}`,
          ],
        };
      },
    );

    // 총 데이터 개수 (3페이지 분량으로 가정)
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
