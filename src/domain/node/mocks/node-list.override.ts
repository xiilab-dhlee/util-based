import { faker } from "@faker-js/faker";

import {
  getGetClusterNodesMockHandler,
  getGetClusterNodesResponseMock,
} from "@/api/generated/admin-cluster/admin-cluster.msw";
import type { ClusterNodeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/**
 * 노드 이름 정렬을 위한 이름 생성
 * ASC: node-001, node-002, ... (오름차순)
 * DESC: node-999, node-998, ... (내림차순)
 */
function generateNodeName(
  index: number,
  sortField: string | null,
  sortOrder: string | null,
): string {
  if (sortField === "NODE_NAME") {
    const paddedIndex = String((index % 1000) + 1).padStart(3, "0");
    const sortableValue = 999 - (index % 1000);
    const sortableNum =
      sortOrder === "ASC"
        ? paddedIndex
        : String(sortableValue).padStart(3, "0");
    return `node-${sortableNum}`;
  }
  return `node-${index}`;
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
          nodeName: generateNodeName(globalIndex, sortField, sortOrder),
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

    return getGetClusterNodesResponseMock({
      data: {
        totalSize,
        totalPageNum: Math.ceil(totalSize / pageSize),
        currentPageNo: pageNo,
        content,
      },
    });
  }),
];
