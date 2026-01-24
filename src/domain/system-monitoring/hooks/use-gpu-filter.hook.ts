"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { GpuTimeseriesData } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

interface GpuOption {
  value: string;
  label: string;
}

interface UseGpuFilterReturn {
  selectedGpuIndices: string[];
  isAllSelected: boolean;
  setSelectedGpuIndices: React.Dispatch<React.SetStateAction<string[]>>;
  gpuOptions: GpuOption[];
  filterGpuData: <T extends GpuTimeseriesData>(data: T[]) => T[];
  resetSelection: () => void;
}

export function useGpuFilter(
  gpuData: GpuTimeseriesData[] | undefined,
  nodeName?: string,
): UseGpuFilterReturn {
  const [selectedGpuIndices, setSelectedGpuIndices] = useState<string[]>([]);

  const gpuOptions = useMemo<GpuOption[]>(() => {
    if (!gpuData || gpuData.length === 0) return [];

    const uniqueGpus = new Map<string, GpuTimeseriesData>();
    for (const gpu of gpuData) {
      if (!uniqueGpus.has(gpu.gpuIndex)) {
        uniqueGpus.set(gpu.gpuIndex, gpu);
      }
    }

    return Array.from(uniqueGpus.values()).map((gpu) => ({
      value: gpu.gpuIndex,
      label: `${gpu.modelName}-${gpu.gpuIndex}`,
    }));
  }, [gpuData]);

  const isAllSelected =
    gpuOptions.length > 0 && selectedGpuIndices.length === gpuOptions.length;

  // 값 기반 변경 감지 (배열 참조 변경 무시)
  const gpuOptionValuesKey = useMemo(
    () =>
      gpuOptions
        .map((o) => o.value)
        .sort()
        .join(","),
    [gpuOptions],
  );

  const gpuOptionsRef = useRef(gpuOptions);
  gpuOptionsRef.current = gpuOptions;

  // biome-ignore lint/correctness/useExhaustiveDependencies: 값 기반 키로 변경 감지
  useEffect(() => {
    const options = gpuOptionsRef.current;
    if (options.length === 0) return;

    setSelectedGpuIndices((prev) => {
      if (prev.length === 0) {
        return options.map((o) => o.value);
      }

      const validValues = new Set(options.map((o) => o.value));
      const filtered = prev.filter((v) => validValues.has(v));

      return filtered.length > 0 ? filtered : options.map((o) => o.value);
    });
  }, [gpuOptionValuesKey]);

  const selectedSet = new Set(selectedGpuIndices);

  const filterGpuData = <T extends GpuTimeseriesData>(data: T[]): T[] => {
    if (selectedGpuIndices.length === 0) return data;
    return data.filter((gpu) => selectedSet.has(gpu.gpuIndex));
  };

  const resetSelection = () => setSelectedGpuIndices([]);

  useEffect(() => {
    if (!nodeName) return;
    setSelectedGpuIndices([]);
  }, [nodeName]);

  return {
    selectedGpuIndices,
    isAllSelected,
    setSelectedGpuIndices,
    gpuOptions,
    filterGpuData,
    resetSelection,
  };
}
