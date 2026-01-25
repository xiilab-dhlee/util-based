import {
  type VolumeListResponse,
  VolumeListResponseVolumeType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetVolumeListMockHandler,
  getGetVolumeListResponseMock,
} from "@/api/generated/volume/volume.msw";
import {
  DAY_IN_MS,
  MOCK_BASE_TIMESTAMP,
} from "@/shared/constants/date.constant";

/** API 스키마에서 정의된 볼륨 타입 값 배열 */
const VOLUME_TYPES = Object.values(VolumeListResponseVolumeType);

/**
 * 정렬 가능한 volumeName 생성
 * 정렬 시 순서가 올바르게 유지되도록 숫자 패딩 사용
 *
 * keyword가 있는 경우에도 정렬 순서 보장
 */
function generateVolumeName(index: number, keyword: string): string {
  const prefix = keyword || "volume";
  const paddedIndex = String((index % 1000) + 1).padStart(3, "0");
  return `${prefix}-${paddedIndex}`;
}

/**
 * 정렬 가능한 createdAt 생성
 * 최신 날짜부터 (현재 → 과거)
 *
 * @param index - 데이터 인덱스
 * @param baseTimestamp - 기준 시간 (기본값: MOCK_BASE_TIMESTAMP)
 */
function generateCreatedAt(
  index: number,
  baseTimestamp: number = MOCK_BASE_TIMESTAMP,
): string {
  // index를 [0, 29] 범위로 클램프하여 미래 날짜 방지
  const safeIndex = Math.min(Math.max(index, 0), 29);
  const offset = safeIndex * DAY_IN_MS;
  return new Date(baseTimestamp - offset).toISOString();
}

/**
 * 파일 크기 생성 (랜덤하지만 결정적인 값)
 * @param index - 데이터 인덱스
 */
function generateFileSizeByte(index: number): number {
  // 1MB ~ 10GB 사이의 값 생성
  const baseSizes = [
    1024 * 1024, // 1MB
    10 * 1024 * 1024, // 10MB
    100 * 1024 * 1024, // 100MB
    1024 * 1024 * 1024, // 1GB
    5 * 1024 * 1024 * 1024, // 5GB
  ];
  return baseSizes[index % baseSizes.length] + index * 1024;
}

export const volumeListOverrideHandlers = [
  // 볼륨 목록 조회 (pageSize에 맞는 개수, keyword 지원)
  getGetVolumeListMockHandler(async (info) => {
    // URL에서 query params 추출
    const url = new URL(info.request.url);
    const keyword = url.searchParams.get("keyword") || "";
    const pageNo = parseInt(url.searchParams.get("pageNo") || "0", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "9", 10);

    const { status, message, timestamp } = getGetVolumeListResponseMock();

    // pageSize에 맞는 content 생성
    const content: VolumeListResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index;

        return {
          volumeId: globalIndex + 1,
          entityId: globalIndex + 1,
          volumeName: generateVolumeName(globalIndex, keyword),
          creatorId: "8e7bc043-c4c5-4524-b65e-845a50f4e4ba",
          creatorName: `사용자-${(globalIndex % 10) + 1}`,
          createdAt: generateCreatedAt(globalIndex),
          volumeType: VOLUME_TYPES[globalIndex % VOLUME_TYPES.length],
          mountPath: `/mnt/volume-${globalIndex + 1}`,
          fileSizeByte: generateFileSizeByte(globalIndex),
          isPublic: globalIndex % 3 !== 0,
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
