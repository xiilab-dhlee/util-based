import {
  getGetAllAccountsMockHandler,
  getGetAllAccountsResponseMock,
} from "@/api/generated/admin-account/admin-account.msw";
import {
  type AccountItemResponse,
  AccountUpdateRequestAccountRole,
  type GetAllAccountsOrder,
  type GetAllAccountsSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  DAY_IN_MS,
  MOCK_BASE_TIMESTAMP,
} from "@/shared/constants/date.constant";

/** API 스키마에서 정의된 권한 값 배열 */
const ACCOUNT_ROLES = Object.values(AccountUpdateRequestAccountRole);

/**
 * 정렬 가능한 accountName 생성
 * 정렬 시 순서가 올바르게 유지되도록 숫자 패딩 사용
 * ASC: user-001, user-002, ... (오름차순)
 * DESC: user-999, user-998, ... (내림차순)
 *
 * keyword가 있는 경우에도 sort/order를 적용하여 정렬 순서 보장
 */
function generateAccountName(
  index: number,
  keyword: string,
  sort: GetAllAccountsSort,
  order: GetAllAccountsOrder,
): string {
  const prefix = keyword || "user";

  if (sort === "ACCOUNT_NAME") {
    // 3자리 숫자로 패딩하여 정렬 순서 보장
    const paddedIndex = String((index % 1000) + 1).padStart(3, "0");
    // ASC: 001, 002, 003... / DESC: 999, 998, 997...
    const sortableValue = 999 - (index % 1000);
    const sortableNum =
      order === "ASC" ? paddedIndex : String(sortableValue).padStart(3, "0");
    return `${prefix}-${sortableNum}`;
  }

  return `${prefix}-${index + 1}`;
}

/**
 * 정렬 가능한 createdAt 생성
 * ASC: 오래된 날짜부터 (과거 → 현재)
 * DESC: 최신 날짜부터 (현재 → 과거)
 *
 * @param index - 데이터 인덱스
 * @param sort - 정렬 기준
 * @param order - 정렬 순서
 * @param baseTimestamp - 기준 시간 (기본값: MOCK_BASE_TIMESTAMP)
 */
function generateCreatedAt(
  index: number,
  sort: GetAllAccountsSort,
  order: GetAllAccountsOrder,
  baseTimestamp: number = MOCK_BASE_TIMESTAMP,
): string {
  if (sort === "CREATED_AT") {
    // index를 [0, 29] 범위로 클램프하여 미래 날짜 방지
    const safeIndex = Math.min(Math.max(index, 0), 29);
    // 정렬 순서에 맞게 날짜 생성
    const offset =
      order === "ASC"
        ? (30 - safeIndex) * DAY_IN_MS // ASC: 오래된 것부터 (30일 전 → 현재)
        : safeIndex * DAY_IN_MS; // DESC: 최신 것부터 (현재 → 과거)
    return new Date(baseTimestamp - offset).toISOString();
  }

  // 기본: 최신순
  return new Date(baseTimestamp - index * DAY_IN_MS).toISOString();
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
        const groupCount = (index % 3) + 1;

        return {
          accountId: `account-${globalIndex + 1}`,
          accountName: generateAccountName(globalIndex, keyword, sort, order),
          email: `account-${globalIndex + 1}@xiilab.com`,
          createdAt: generateCreatedAt(globalIndex, sort, order),
          accountRole: ACCOUNT_ROLES[index % ACCOUNT_ROLES.length],
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
