import { MIN_HISTORY_RANGE_MS } from "@/domain/system-monitoring/constants/system-monitoring.constant";
import type { SystemResourcesSummaryResponse } from "@/domain/system-monitoring/types/system-monitoring.type";
import type { ReturnTypeOfGetResourceInfo } from "@/shared/utils/resource.util";
import { convertBytes, getResourceInfo } from "@/shared/utils/resource.util";

/**
 * 히스토리 모드에서 사용할 날짜 범위를 정규화합니다.
 *
 * - start/end 간격이 MIN_HISTORY_RANGE_MS 미만이면,
 *   start 를 기준으로 end 를 MIN_HISTORY_RANGE_MS 이후로 보정합니다.
 */
export function normalizeMonitoringHistoryRange(range: {
  start: Date;
  end: Date;
}): { start: Date; end: Date } {
  const startMs = range.start.getTime();
  const endMs = range.end.getTime();

  if (endMs - startMs < MIN_HISTORY_RANGE_MS) {
    return {
      start: range.start,
      end: new Date(startMs + MIN_HISTORY_RANGE_MS),
    };
  }

  return range;
}

/**
 * 리소스 요약 정보 타입
 */
export interface ResourceSummary {
  gpu: {
    info: ReturnTypeOfGetResourceInfo;
    count: number;
  };
  cpu: {
    info: ReturnTypeOfGetResourceInfo;
    core: number;
  };
  memory: {
    info: ReturnTypeOfGetResourceInfo;
    amount: number;
  };
  disk: {
    info: ReturnTypeOfGetResourceInfo;
    amount: number;
  };
}

/**
 * 노드 요약 정보로부터 리소스 요약 객체를 생성
 *
 * @param nodeSummary - 노드 요약 정보 (API 응답)
 * @returns 화면 표시용 리소스 요약 객체
 */
export function buildResourceSummary(
  nodeSummary: SystemResourcesSummaryResponse | undefined,
): ResourceSummary {
  const gpuResourceInfo = getResourceInfo("GPU");
  const cpuResourceInfo = getResourceInfo("CPU");
  const memoryResourceInfo = getResourceInfo("MEM");
  const diskResourceInfo = getResourceInfo("DISK");

  const memoryValue = nodeSummary
    ? convertBytes(nodeSummary.resource.memoryByte, "GB", 1).value
    : 0;

  const diskValue = nodeSummary
    ? convertBytes(nodeSummary.resource.diskByte, "GB", 0).value
    : 0;

  return {
    gpu: {
      info: gpuResourceInfo,
      count: nodeSummary?.resource.gpuCount ?? 0,
    },
    cpu: {
      info: cpuResourceInfo,
      core: nodeSummary?.resource.cpuCore ?? 0,
    },
    memory: {
      info: memoryResourceInfo,
      amount: memoryValue,
    },
    disk: {
      info: diskResourceInfo,
      amount: diskValue,
    },
  };
}
