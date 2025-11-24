"use client";

import { useEffect, useMemo, useState } from "react";

import type { SystemResourcesSummaryResponse } from "@/domain/system-monitoring/types/system-monitoring.type";
import { ALL_OPTION } from "@/shared/constants/core.constant";

/**
 * GPU 필터 관리 훅
 *
 * 노드의 GPU 정보를 기반으로 드롭다운 옵션과 API 요청용 필터를 관리합니다.
 *
 * @param nodeSummary - 노드 요약 정보
 * @returns GPU 선택 상태, 옵션, 필터
 */
export function useGpuFilter(
  nodeSummary: SystemResourcesSummaryResponse | undefined,
) {
  const [selectedGpu, setSelectedGpu] = useState<string>(ALL_OPTION.value);

  // GPU 드롭다운 옵션 생성
  const gpuOptions = useMemo(() => {
    if (!nodeSummary?.gpuName) return [ALL_OPTION];

    const gpuNames = nodeSummary.gpuName;
    return [
      ALL_OPTION,
      ...gpuNames.map((name) => ({
        value: name,
        label: name,
      })),
    ];
  }, [nodeSummary?.gpuName]);

  // GPU 메트릭에 사용할 최종 GPU 필터 배열
  // - ALL 또는 미선택: 노드에 존재하는 모든 GPU 이름
  // - 특정 GPU 선택: 해당 GPU 이름만 배열로 전달
  const selectedGpuFilter = useMemo(() => {
    const gpuNames = nodeSummary?.gpuName ?? [];
    if (gpuNames.length === 0) return undefined;

    if (!selectedGpu || selectedGpu === ALL_OPTION.value) {
      return gpuNames;
    }

    if (gpuNames.includes(selectedGpu)) {
      return [selectedGpu];
    }

    // 예외 상황(옵션 목록과 선택 값이 불일치 등)에서는 안전하게 전체를 전달
    return gpuNames;
  }, [nodeSummary?.gpuName, selectedGpu]);

  // 노드가 변경될 때마다 GPU 선택 초기화
  useEffect(() => {
    setSelectedGpu(ALL_OPTION.value);
    void nodeSummary?.nodeName; // eslint-disable-line react-hooks/exhaustive-deps을 위함.
  }, [nodeSummary?.nodeName]);

  return {
    selectedGpu,
    setSelectedGpu,
    gpuOptions,
    selectedGpuFilter,
  };
}
