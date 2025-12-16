import { HttpResponse, http } from "msw";

import {
  RESOURCE_PRESET_DETAIL_MOCK_DATA,
  RESOURCE_PRESET_MOCK_DATA,
} from "@/domain/resource-preset/mocks/resource-preset.mock";
import type {
  ResourcePresetDetailResponseType,
  ResourcePresetListResponseType,
} from "@/domain/resource-preset/schemas/resource-preset.schema";
import type { CoreListResponse } from "@/shared/types/core.model";

const BASE_URL = "/core-api/v1/core/admin/resource-preset";

/**
 * 리소스 프리셋 API 핸들러
 */
export const resourcePresetHandlers = [
  /**
   * 리소스 프리셋 목록 조회
   * GET /core-api/v1/core/admin/resource-preset
   */
  http.get(BASE_URL, ({ request }) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page") ?? "1");
    const size = Number(url.searchParams.get("size") ?? "20");
    const jobType = url.searchParams.get("jobType");
    const nodeType = url.searchParams.get("nodeType");
    const search = url.searchParams.get("search");

    // 필터링
    let filteredData = [...RESOURCE_PRESET_MOCK_DATA];

    if (jobType) {
      filteredData = filteredData.filter((item) => item.jobType === jobType);
    }

    if (nodeType) {
      filteredData = filteredData.filter((item) => item.nodeType === nodeType);
    }

    if (search) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // 페이지네이션
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return HttpResponse.json<CoreListResponse<ResourcePresetListResponseType>>({
      content: paginatedData,
      totalSize: filteredData.length,
    });
  }),

  /**
   * 리소스 프리셋 상세 조회
   * GET /core-api/v1/core/admin/resource-preset/:id
   */
  http.get(`${BASE_URL}/:id`, ({ params }) => {
    const { id } = params;

    const preset = RESOURCE_PRESET_DETAIL_MOCK_DATA.find(
      (item) => item.id === id,
    );

    if (!preset) {
      return HttpResponse.json(
        { message: "자원 프리셋을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return HttpResponse.json<ResourcePresetDetailResponseType>(preset);
  }),

  /**
   * 리소스 프리셋 생성
   * POST /core-api/v1/core/admin/resource-preset
   */
  http.post(BASE_URL, async ({ request }) => {
    const body =
      (await request.json()) as Partial<ResourcePresetDetailResponseType>;

    const newPreset: ResourcePresetDetailResponseType = {
      id: crypto.randomUUID(),
      name: body.name ?? "",
      description: body.description ?? null,
      jobType: body.jobType ?? "BATCH",
      nodeType: body.nodeType ?? "single",
      gpuType: body.gpuType ?? "NORMAL",
      gpuName: body.gpuName ?? "Unknown GPU",
      gpuMemory: body.gpuMemory ?? 0,
      gpu: body.gpu ?? 0,
      gpuMax: body.gpuMax ?? 0,
      cpu: body.cpu ?? 0,
      cpuMax: body.cpuMax ?? 0,
      memory: body.memory ?? 0,
      memoryMax: body.memoryMax ?? 0,
      nodes: body.nodes ?? [],
      creatorName: body.creatorName ?? "Admin",
      createdAt: new Date().toISOString(),
    };

    return HttpResponse.json(newPreset, { status: 201 });
  }),

  /**
   * 리소스 프리셋 수정
   * PUT /core-api/v1/core/admin/resource-preset/:id
   */
  http.put(`${BASE_URL}/:id`, async ({ params, request }) => {
    const { id } = params;
    const body =
      (await request.json()) as Partial<ResourcePresetDetailResponseType>;

    const detailPreset = RESOURCE_PRESET_DETAIL_MOCK_DATA.find(
      (item) => item.id === id,
    );

    if (!detailPreset) {
      return HttpResponse.json(
        { message: "자원 프리셋을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const updatedPreset: ResourcePresetDetailResponseType = {
      ...detailPreset,
      ...body,
      id: detailPreset.id, // id는 변경 불가
    };

    return HttpResponse.json(updatedPreset);
  }),

  /**
   * 리소스 프리셋 삭제
   * DELETE /core-api/v1/core/admin/resource-preset/:id
   */
  http.delete(`${BASE_URL}/:id`, ({ params }) => {
    const { id } = params;

    const preset = RESOURCE_PRESET_MOCK_DATA.find((item) => item.id === id);

    if (!preset) {
      return HttpResponse.json(
        { message: "자원 프리셋을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return HttpResponse.json({ success: true });
  }),
];
