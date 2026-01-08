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
 * 정렬 시 순서가 올바르게 유지되도록 숫자 패딩 사용
 * ASC: user-001, user-002, ... (오름차순)
 * DESC: user-999, user-998, ... (내림차순)
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
    // 3자리 숫자로 패딩하여 정렬 순서 보장
    const paddedIndex = String((index % 1000) + 1).padStart(3, "0");
    // ASC: 001, 002, 003... / DESC: 999, 998, 997...
    // wrap을 사용하여 index >= 1000에서도 음수 방지
    const sortableValue = 999 - (index % 1000);
    const sortableNum =
      order === "ASC" ? paddedIndex : String(sortableValue).padStart(3, "0");
    return `user-${sortableNum}`;
  }

  return `user-${index + 1}`;
}

/**
 * 정렬 가능한 createdAt 생성
 * ASC: 오래된 날짜부터 (과거 → 현재)
 * DESC: 최신 날짜부터 (현재 → 과거)
 *
 * @param index - 데이터 인덱스
 * @param sort - 정렬 기준
 * @param order - 정렬 순서
 * @param baseTimestamp - 기준 시간 (테스트용, 기본값: Date.now())
 */
function generateCreatedAt(
  index: number,
  sort: GetAllAccountsSort,
  order: GetAllAccountsOrder,
  baseTimestamp: number = Date.now(),
): string {
  const dayInMs = 24 * 60 * 60 * 1000;

  if (sort === "CREATED_AT") {
    // 정렬 순서에 맞게 날짜 생성
    const offset =
      order === "ASC"
        ? (30 - index) * dayInMs // ASC: 오래된 것부터 (30일 전 → 현재)
        : index * dayInMs; // DESC: 최신 것부터 (현재 → 과거)
    return new Date(baseTimestamp - offset).toISOString();
  }

  // 기본: 최신순
  return new Date(baseTimestamp - index * dayInMs).toISOString();
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

    // 요청 내에서 일관된 날짜 생성을 위해 고정된 timestamp 사용
    const baseTimestamp = Date.now();

    // pageSize에 맞는 content 생성
    const content: AccountItemResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index;
        const groupCount = (index % 3) + 1;

        return {
          accountId: `account-${globalIndex + 1}`,
          accountName: generateAccountName(globalIndex, keyword, sort, order),
          email: `account-${globalIndex + 1}@xiilab.com`,
          createdAt: generateCreatedAt(globalIndex, sort, order, baseTimestamp),
          accountRole: (["ADMIN", "USER", "SUPER_ADMIN"] as const)[index % 3],
          workspaceCount: (globalIndex % 10) + 1,
          workspaceLimitCount: 10,
          isEnabled: index % 3 !== 0,
          groupName: Array.from(
            { length: groupCount },
            (_, i) => `그룹-${i + 1}`,
          ),
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
