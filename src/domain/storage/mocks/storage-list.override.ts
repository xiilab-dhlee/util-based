import {
  type StorageResponse,
  StorageResponseStorageChannel,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetStorages1MockHandler,
  getGetStorages1ResponseMock,
} from "@/api/generated/storage/storage.msw";

/**
 * 스토리지 이름 생성
 */
function generateStorageName(index: number): string {
  return `storage-${index + 1}`;
}

/**
 * 스토리지 IP 생성
 */
function generateStorageIp(index: number): string {
  return `192.168.1.${(index % 255) + 1}`;
}

/**
 * 스토리지 저장 경로 생성
 */
function generateStorageSavePath(index: number): string {
  return `/mnt/storage/data-${index + 1}`;
}

export const storageListOverrideHandlers = [
  // 스토리지 목록 조회 (pageSize에 맞는 개수)
  getGetStorages1MockHandler(async (info) => {
    // URL에서 query params 추출 (pageableRequest.pageNo, pageableRequest.pageSize 형식)
    const url = new URL(info.request.url);
    const pageNo = parseInt(
      url.searchParams.get("pageableRequest.pageNo") || "0",
      10,
    );
    const pageSize = parseInt(
      url.searchParams.get("pageableRequest.pageSize") || "10",
      10,
    );

    const { status, message, timestamp } = getGetStorages1ResponseMock();

    // pageSize에 맞는 content 생성
    const content: StorageResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index;

        return {
          storageId: globalIndex + 1,
          storageName: generateStorageName(globalIndex),
          storageChannel: StorageResponseStorageChannel.NFS,
          storageIp: generateStorageIp(globalIndex),
          storageSavePath: generateStorageSavePath(globalIndex),
          createdAt: new Date(
            Date.now() - globalIndex * 24 * 60 * 60 * 1000,
          ).toISOString(),
          creatorId: `user-${(globalIndex % 5) + 1}`,
          creatorName: `사용자 ${(globalIndex % 5) + 1}`,
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
