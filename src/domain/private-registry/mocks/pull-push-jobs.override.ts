import type { PullPushJobResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetPullPushJobs1MockHandler,
  getGetPullPushJobs1ResponseMock,
} from "@/api/generated/private-registry/private-registry.msw";
import { MOCK_BASE_TIMESTAMP } from "@/shared/constants/date.constant";

/**
 * Job 상태 목록
 */
const JOB_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"] as const;

/**
 * 이미지 이름 생성
 */
function generateImageName(index: number, keyword: string): string {
  const prefix = keyword || "private-image";
  return `${prefix}-${index + 1}`;
}

/**
 * Job 생성일시 생성
 */
function generateJobCreatedAt(
  index: number,
  baseTimestamp: number = MOCK_BASE_TIMESTAMP,
): string {
  // 최근 24시간 이내의 시간으로 생성
  const hoursAgo = index % 24;
  const offset = hoursAgo * 60 * 60 * 1000; // hours to milliseconds
  return new Date(baseTimestamp - offset).toISOString();
}

/**
 * Job 상태 생성 (인덱스 기반)
 */
function generateJobStatus(index: number): string {
  return JOB_STATUSES[index % JOB_STATUSES.length];
}

export const pullPushJobsOverrideHandlers = [
  getGetPullPushJobs1MockHandler(async (info) => {
    const url = new URL(info.request.url);
    const keyword = url.searchParams.get("keyword") || "";
    const pageNo = parseInt(url.searchParams.get("pageNo") || "0", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

    const { status, message, timestamp } = getGetPullPushJobs1ResponseMock();

    const content: PullPushJobResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const imageName = generateImageName(index, keyword);
        const creatorIndex = index % 5;

        return {
          imageId: index + 1,
          imageTagId: (index % 10) + 1,
          imageTagName: `v1.${index}.0`,
          imageName,
          creatorId: `user-${creatorIndex + 1}`,
          creatorName: `사용자-${creatorIndex + 1}`,
          status: generateJobStatus(index),
          createdAt: generateJobCreatedAt(index),
        };
      },
    );

    // 페이징 처리
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
