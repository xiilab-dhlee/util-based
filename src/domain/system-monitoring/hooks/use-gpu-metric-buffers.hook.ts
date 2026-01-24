"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { GpuTimeseriesData } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { DEFAULT_BUFFER_SIZE } from "@/domain/system-monitoring/constants/system-monitoring.constant";
import type {
  AllGpuMetricBuffers,
  AllGpuMetricsData,
  GpuBufferState,
  GpuMetricBufferMap,
} from "@/domain/system-monitoring/types/metrics.type";
import {
  createRingBuffer,
  pushToRingBuffer,
} from "@/domain/system-monitoring/utils/ring-buffer.util";

interface UseGpuMetricBuffersParams {
  /** 버퍼 최대 크기 */
  bufferSize?: number;
  /** 노드명 (변경 시 버퍼 리셋) */
  nodeName: string;
}

interface BufferUpdateData {
  utilization?: GpuTimeseriesData[];
  memory?: GpuTimeseriesData[];
  temperature?: GpuTimeseriesData[];
  powerUsage?: GpuTimeseriesData[];
}

interface UseGpuMetricBuffersReturn {
  /** 현재 버퍼 상태 */
  buffers: AllGpuMetricBuffers;
  /** 버퍼 업데이트 (새 데이터 추가) */
  updateBuffers: (data: BufferUpdateData) => void;
  /** 버퍼 리셋 */
  resetBuffers: () => void;
  /** 초기 데이터로 버퍼 설정 */
  initFromData: (data: AllGpuMetricsData) => void;
  /** 버퍼를 GpuTimeseriesData[] 형태로 변환 */
  toGpuTimeseriesData: (bufferMap: GpuMetricBufferMap) => GpuTimeseriesData[];
}

/**
 * 빈 버퍼 세트 생성
 */
function createEmptyBuffers(): AllGpuMetricBuffers {
  return {
    utilization: new Map(),
    memory: new Map(),
    temperature: new Map(),
    powerUsage: new Map(),
  };
}

/**
 * GpuTimeseriesData[]를 버퍼 맵으로 변환
 */
function gpuDataToBufferMap(
  gpuData: GpuTimeseriesData[],
  bufferSize: number,
): GpuMetricBufferMap {
  const map = new Map<string, GpuBufferState>();
  for (const gpu of gpuData) {
    map.set(gpu.gpuIndex, {
      modelName: gpu.modelName,
      buffer: pushToRingBuffer(createRingBuffer(bufferSize), gpu.values),
    });
  }
  return map;
}

/**
 * 기존 버퍼 맵에 새 데이터 추가
 */
function updateBufferMap(
  prevMap: GpuMetricBufferMap,
  newData: GpuTimeseriesData[],
  bufferSize: number,
): GpuMetricBufferMap {
  const newMap = new Map(prevMap);

  for (const gpu of newData) {
    if (gpu.values.length === 0) continue;

    const existing = newMap.get(gpu.gpuIndex);
    if (existing) {
      newMap.set(gpu.gpuIndex, {
        ...existing,
        buffer: pushToRingBuffer(existing.buffer, gpu.values),
      });
    } else {
      newMap.set(gpu.gpuIndex, {
        modelName: gpu.modelName,
        buffer: pushToRingBuffer(createRingBuffer(bufferSize), gpu.values),
      });
    }
  }

  return newMap;
}

/**
 * GPU 메트릭 버퍼 관리 훅
 *
 * SSE 스트리밍 데이터를 GPU별 링 버퍼로 관리합니다:
 * - GPU별 버퍼 생성/리셋
 * - 데이터 추가 (FIFO)
 * - 초기 데이터 로드
 *
 * @example
 * const { buffers, updateBuffers, initFromData, toGpuTimeseriesData } = useGpuMetricBuffers({
 *   bufferSize: 5000,
 *   nodeName: "node-1",
 * });
 *
 * initFromData(historyData);
 * updateBuffers({ utilization: newUtilData, memory: newMemData });
 * const chartData = toGpuTimeseriesData(buffers.utilization);
 */
export function useGpuMetricBuffers({
  bufferSize = DEFAULT_BUFFER_SIZE,
  nodeName,
}: UseGpuMetricBuffersParams): UseGpuMetricBuffersReturn {
  const [buffers, setBuffers] =
    useState<AllGpuMetricBuffers>(createEmptyBuffers);
  const initialDataLoadedRef = useRef(false);
  const prevNodeNameRef = useRef(nodeName);

  const resetBuffers = useCallback(() => {
    setBuffers(createEmptyBuffers());
    initialDataLoadedRef.current = false;
  }, []);

  useEffect(() => {
    if (prevNodeNameRef.current !== nodeName) {
      resetBuffers();
      prevNodeNameRef.current = nodeName;
    }
  }, [nodeName, resetBuffers]);

  const updateBuffers = useCallback(
    (data: BufferUpdateData) => {
      setBuffers((prev) => ({
        utilization:
          data.utilization && data.utilization.length > 0
            ? updateBufferMap(prev.utilization, data.utilization, bufferSize)
            : prev.utilization,
        memory:
          data.memory && data.memory.length > 0
            ? updateBufferMap(prev.memory, data.memory, bufferSize)
            : prev.memory,
        temperature:
          data.temperature && data.temperature.length > 0
            ? updateBufferMap(prev.temperature, data.temperature, bufferSize)
            : prev.temperature,
        powerUsage:
          data.powerUsage && data.powerUsage.length > 0
            ? updateBufferMap(prev.powerUsage, data.powerUsage, bufferSize)
            : prev.powerUsage,
      }));
    },
    [bufferSize],
  );

  const initFromData = useCallback(
    (data: AllGpuMetricsData) => {
      if (initialDataLoadedRef.current) return;

      setBuffers({
        utilization: gpuDataToBufferMap(data.utilization, bufferSize),
        memory: gpuDataToBufferMap(data.memory, bufferSize),
        temperature: gpuDataToBufferMap(data.temperature, bufferSize),
        powerUsage: gpuDataToBufferMap(data.powerUsage, bufferSize),
      });
      initialDataLoadedRef.current = true;
    },
    [bufferSize],
  );

  const toGpuTimeseriesData = useCallback(
    (bufferMap: GpuMetricBufferMap): GpuTimeseriesData[] => {
      return Array.from(bufferMap.entries())
        .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
        .map(([gpuIndex, state]) => ({
          gpuIndex,
          modelName: state.modelName,
          values: state.buffer.data,
        }));
    },
    [],
  );

  return {
    buffers,
    updateBuffers,
    resetBuffers,
    initFromData,
    toGpuTimeseriesData,
  };
}
