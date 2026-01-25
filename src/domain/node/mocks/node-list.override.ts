import { faker } from "@faker-js/faker";

import {
  getGetClusterNodesMockHandler,
  getGetClusterNodesResponseMock,
} from "@/api/generated/admin-cluster/admin-cluster.msw";
import type { ClusterNodeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/**
 * 노드 이름 생성 (정렬 가능한 형식)
 */
function generateNodeName(index: number): string {
  return `node-${String(index).padStart(3, "0")}`;
}

/**
 * 노드 목록 정렬
 */
function sortNodeContent(
  content: ClusterNodeListResponse[],
  sortField: string | null,
  sortOrder: string | null,
): ClusterNodeListResponse[] {
  if (sortField !== "NODE_NAME") return content;

  const sorted = [...content];
  const isAsc = sortOrder === "ASC";

  sorted.sort((a, b) => {
    const comparison = (a.nodeName || "").localeCompare(b.nodeName || "");
    return isAsc ? comparison : -comparison;
  });

  return sorted;
}

/**
 * 노드 목록 API override handler
 * - 노드 이름 정렬 기능 지원
 */
export const nodeListOverrideHandlers = [
  getGetClusterNodesMockHandler(async (info) => {
    const url = new URL(info.request.url);

    // 페이지네이션 파라미터
    const pageNo = Number.parseInt(
      url.searchParams.get("pageableRequest[pageNo]") || "0",
      10,
    );
    const pageSize = Number.parseInt(
      url.searchParams.get("pageableRequest[pageSize]") || "10",
      10,
    );

    // 정렬 파라미터
    const sortField = url.searchParams.get("sortRequest[sort]");
    const sortOrder = url.searchParams.get("sortRequest[order]");

    const totalSize = pageSize * 3;

    // 기본 mock response 가져오기
    const mockResponse = getGetClusterNodesResponseMock();
    const baseItem = mockResponse.data?.content?.[0];

    // 노드 목록 생성
    const content: ClusterNodeListResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index + 1;

        return {
          ...baseItem,
          nodeName: generateNodeName(globalIndex),
          nodeIp: `192.168.1.${(globalIndex % 255) + 1}`,
          gpuType: faker.helpers.arrayElement([
            "NVIDIA A100-SXM4-80GB",
            "NVIDIA H100-SXM5-80GB",
            "NVIDIA A30",
          ]),
          gpuCount: faker.number.int({ min: 1, max: 8 }),
          gpuUtilizationPercent: faker.number.float({
            min: 0,
            max: 100,
            fractionDigits: 2,
          }),
          cpuUtilizationPercent: faker.number.float({
            min: 0,
            max: 100,
            fractionDigits: 2,
          }),
          memoryUtilizationPercent: faker.number.float({
            min: 0,
            max: 100,
            fractionDigits: 2,
          }),
          diskUtilizationPercent: faker.number.float({
            min: 0,
            max: 100,
            fractionDigits: 2,
          }),
          createdAt: faker.date.past().toISOString(),
          isScheduling: faker.datatype.boolean(),
          isMigEnabled: faker.datatype.boolean(),
          migConfigState: faker.helpers.arrayElement([
            "NOT_SUPPORTED",
            "NONE",
            "PENDING",
            "FAILED",
            "READY",
          ] as const),
        } as ClusterNodeListResponse;
      },
    );

    // 정렬 적용
    const sortedContent = sortNodeContent(content, sortField, sortOrder);

    return getGetClusterNodesResponseMock({
      data: {
        totalSize,
        totalPageNum: Math.ceil(totalSize / pageSize),
        currentPageNo: pageNo,
        content: sortedContent,
      },
    });
  }),
];
