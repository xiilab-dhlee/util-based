import {
  getGetSignupRequestsMockHandler,
  getGetSignupRequestsResponseMock,
} from "@/api/generated/admin-account/admin-account.msw";
import type {
  GetSignupRequestsOrder,
  GetSignupRequestsSort,
  SignupRequestItemResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/**
 * 정렬 가능한 accountName 생성
 */
function generateAccountName(
  index: number,
  keyword: string,
  sort: GetSignupRequestsSort,
  order: GetSignupRequestsOrder,
): string {
  if (keyword) {
    return `${keyword}-${index + 1}`;
  }

  if (sort === "ACCOUNT_NAME") {
    const paddedIndex = String((index % 1000) + 1).padStart(3, "0");
    const sortableValue = 999 - (index % 1000);
    const sortableNum =
      order === "ASC" ? paddedIndex : String(sortableValue).padStart(3, "0");
    return `pending-user-${sortableNum}`;
  }

  return `pending-user-${index + 1}`;
}

/**
 * 정렬 가능한 createdAt 생성
 */
function generateCreatedAt(
  index: number,
  sort: GetSignupRequestsSort,
  order: GetSignupRequestsOrder,
  baseTimestamp: number = Date.now(),
): string {
  const dayInMs = 24 * 60 * 60 * 1000;

  if (sort === "CREATED_AT") {
    const offset =
      order === "ASC"
        ? (30 - index) * dayInMs // ASC: 오래된 것부터
        : index * dayInMs; // DESC: 최신 것부터
    return new Date(baseTimestamp - offset).toISOString();
  }

  // 기본: 최신순
  return new Date(baseTimestamp - index * dayInMs).toISOString();
}

export const adminAccountPendingListOverrideHandlers = [
  getGetSignupRequestsMockHandler(async (info) => {
    const url = new URL(info.request.url);
    const keyword = url.searchParams.get("keyword") || "";
    const pageNo = parseInt(url.searchParams.get("pageNo") || "0", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const sort = (url.searchParams.get("sortRequest[sort]") ||
      "CREATED_AT") as GetSignupRequestsSort;
    const order = (url.searchParams.get("sortRequest[order]") ||
      "DESC") as GetSignupRequestsOrder;

    const { status, message, timestamp } = getGetSignupRequestsResponseMock();

    const baseTimestamp = Date.now();

    const content: SignupRequestItemResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index;

        return {
          accountId: `pending-account-${globalIndex + 1}`,
          accountName: generateAccountName(globalIndex, keyword, sort, order),
          email: `pending-${globalIndex + 1}@xiilab.com`,
          createdAt: generateCreatedAt(globalIndex, sort, order, baseTimestamp),
        };
      },
    );

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
