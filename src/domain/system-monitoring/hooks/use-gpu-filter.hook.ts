"use client";

import { useEffect, useMemo, useState } from "react";

import type { SystemResourcesSummaryResponse } from "@/domain/system-monitoring/types/system-monitoring.type";

/**
 * GPU 필터 관리 훅
 *
 * 노드의 GPU 정보를 기반으로 드롭다운 옵션과 API 요청용 필터를 관리합니다.
 * 빈 배열([])은 모든 GPU가 선택된 상태를 의미합니다.
 *
 * @param nodeSummary - 노드 요약 정보
 * @returns GPU 선택 상태, 옵션, 필터
 */
export function useGpuFilter(
  nodeSummary: SystemResourcesSummaryResponse | undefined,
) {
  const [selectedGpus, setSelectedGpus] = useState<string[]>([]);

  // GPU 드롭다운 옵션 생성
  const gpuOptions = useMemo(() => {
    if (!nodeSummary?.gpuName) return [];

    return nodeSummary.gpuName.map((name) => ({
      value: name,
      label: name,
    }));
  }, [nodeSummary?.gpuName]);

  // GPU 메트릭에 사용할 최종 GPU 필터 배열
  // - 빈 배열: 노드에 존재하는 모든 GPU 이름
  // - 특정 GPU 선택: 선택된 GPU 이름만 배열로 전달
  const selectedGpuFilter = useMemo(() => {
    const gpuNames = nodeSummary?.gpuName ?? [];
    if (gpuNames.length === 0) return undefined;

    // 빈 배열은 모든 GPU 선택을 의미
    if (selectedGpus.length === 0) {
      return gpuNames;
    }

    // 선택된 GPU만 필터링하여 반환
    return selectedGpus.filter((gpu) => gpuNames.includes(gpu));
  }, [nodeSummary?.gpuName, selectedGpus]);

  // 노드가 변경될 때마다 GPU 선택 초기화
  useEffect(() => {
    setSelectedGpus([]);
    void nodeSummary?.nodeName; // eslint-disable-line react-hooks/exhaustive-deps을 위함.
  }, [nodeSummary?.nodeName]);

  return {
    selectedGpus,
    setSelectedGpus,
    gpuOptions,
    selectedGpuFilter,
  };
}
