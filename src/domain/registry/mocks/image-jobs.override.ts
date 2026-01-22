import {
  GetImageJobsImageSourceType,
  type ImageJobResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetImageJobsMockHandler,
  getGetImageJobsResponseMock,
} from "@/api/generated/image-job/image-job.msw";
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

/**
 * 이미지 소스 타입 생성 (인덱스 기반)
 * 짝수: SNAPSHOT, 홀수: EXTERNAL
 */
function generateImageSourceType(index: number): GetImageJobsImageSourceType {
  return index % 2 === 0
    ? GetImageJobsImageSourceType.SNAPSHOT
    : GetImageJobsImageSourceType.EXTERNAL;
}

export const imageJobsOverrideHandlers = [
  getGetImageJobsMockHandler(async (info) => {
    const url = new URL(info.request.url);
    const keyword = url.searchParams.get("keyword") || "";
    const pageNo = parseInt(url.searchParams.get("pageNo") || "0", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const imageSourceType = url.searchParams.get(
      "imageSourceType",
    ) as GetImageJobsImageSourceType | null;

    const { status, message, timestamp } = getGetImageJobsResponseMock();

    // 필터링이 있으면 해당 타입만, 없으면 전체
    const baseTotalSize = pageSize * 3;
    // 필터 적용 시 해당 타입의 절반 정도로 가정
    const totalSize = imageSourceType
      ? Math.ceil(baseTotalSize / 2)
      : baseTotalSize;

    const content: ImageJobResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index;
        const imageName = generateImageName(globalIndex, keyword);
        const creatorIndex = globalIndex % 5;

        return {
          imageId: globalIndex + 1,
          imageTagId: (globalIndex % 10) + 1,
          imageTagName: `v1.${globalIndex}.0`,
          imageName,
          creatorId: `user-${creatorIndex + 1}`,
          creatorName: `사용자-${creatorIndex + 1}`,
          status: generateJobStatus(globalIndex),
          createdAt: generateJobCreatedAt(globalIndex),
          // 필터가 적용된 경우 해당 타입만, 아니면 인덱스 기반 타입
          imageSourceType: imageSourceType
            ? imageSourceType
            : generateImageSourceType(globalIndex),
        };
      },
    );

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
