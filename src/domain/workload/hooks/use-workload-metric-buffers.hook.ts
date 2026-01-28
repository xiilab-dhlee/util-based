"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  createRingBuffer,
  pushToRingBuffer,
  type RingBufferState,
} from "@/domain/system-monitoring/utils/ring-buffer.util";
import { DEFAULT_BUFFER_SIZE } from "@/domain/workload/constants/workload-monitoring.constant";
import type {
  MetricValue,
  WorkloadMetricSeriesGroup,
} from "@/domain/workload/types/workload-metrics.type";

interface UseWorkloadMetricBuffersParams {
  /** 버퍼 최대 크기 (기본: 5000) */
  bufferSize?: number;
  /** 워크로드 리소스 이름 (변경 시 버퍼 리셋) */
  workloadResourceName: string;
}

interface UseWorkloadMetricBuffersReturn {
  /** 현재 버퍼 상태 */
  buffers: WorkloadMetricBuffers;
  /** 버퍼 업데이트 (새 데이터 추가) */
  updateBuffers: (data: Partial<BufferUpdateData>) => void;
  /** 버퍼 리셋 */
  resetBuffers: () => void;
  /** 초기 데이터로 버퍼 설정 */
  initFromData: (data: WorkloadMetricSeriesGroup) => void;
}

interface WorkloadMetricBuffers {
  gpuUtilization: RingBufferState<MetricValue>;
  gpuMemUtilization: RingBufferState<MetricValue>;
  cpuUtilization: RingBufferState<MetricValue>;
  memUtilization: RingBufferState<MetricValue>;
}

interface BufferUpdateData {
  gpuUtilization: MetricValue[];
  gpuMemUtilization: MetricValue[];
  cpuUtilization: MetricValue[];
  memUtilization: MetricValue[];
}

/**
 * 빈 버퍼 세트 생성
 */
function createEmptyBuffers(bufferSize: number): WorkloadMetricBuffers {
  return {
    gpuUtilization: createRingBuffer(bufferSize),
    gpuMemUtilization: createRingBuffer(bufferSize),
    cpuUtilization: createRingBuffer(bufferSize),
    memUtilization: createRingBuffer(bufferSize),
  };
}

/**
 * 워크로드 메트릭 버퍼 관리 훅
 *
 * SSE 스트리밍 데이터를 링 버퍼로 관리합니다:
 * - 버퍼 생성/리셋
 * - 데이터 추가 (FIFO)
 * - 초기 데이터 로드
 *
 * @example
 * const { buffers, updateBuffers, initFromData } = useWorkloadMetricBuffers({
 *   bufferSize: 5000,
 *   workloadResourceName: "workload-123",
 * });
 *
 * initFromData(historyData);
 * updateBuffers({ gpuUtilization: newGpuData, cpuUtilization: newCpuData });
 */
export function useWorkloadMetricBuffers({
  bufferSize = DEFAULT_BUFFER_SIZE,
  workloadResourceName,
}: UseWorkloadMetricBuffersParams): UseWorkloadMetricBuffersReturn {
  const [buffers, setBuffers] = useState<WorkloadMetricBuffers>(() =>
    createEmptyBuffers(bufferSize),
  );
  const initialDataLoadedRef = useRef(false);
  const prevWorkloadNameRef = useRef(workloadResourceName);

  const resetBuffers = useCallback(() => {
    setBuffers(createEmptyBuffers(bufferSize));
    initialDataLoadedRef.current = false;
  }, [bufferSize]);

  // 워크로드가 변경되면 버퍼 리셋
  useEffect(() => {
    if (prevWorkloadNameRef.current !== workloadResourceName) {
      resetBuffers();
      prevWorkloadNameRef.current = workloadResourceName;
    }
  }, [workloadResourceName, resetBuffers]);

  const updateBuffers = useCallback((data: Partial<BufferUpdateData>) => {
    setBuffers((prev) => ({
      gpuUtilization:
        data.gpuUtilization && data.gpuUtilization.length > 0
          ? pushToRingBuffer(prev.gpuUtilization, data.gpuUtilization)
          : prev.gpuUtilization,
      gpuMemUtilization:
        data.gpuMemUtilization && data.gpuMemUtilization.length > 0
          ? pushToRingBuffer(prev.gpuMemUtilization, data.gpuMemUtilization)
          : prev.gpuMemUtilization,
      cpuUtilization:
        data.cpuUtilization && data.cpuUtilization.length > 0
          ? pushToRingBuffer(prev.cpuUtilization, data.cpuUtilization)
          : prev.cpuUtilization,
      memUtilization:
        data.memUtilization && data.memUtilization.length > 0
          ? pushToRingBuffer(prev.memUtilization, data.memUtilization)
          : prev.memUtilization,
    }));
  }, []);

  const initFromData = useCallback(
    (data: WorkloadMetricSeriesGroup) => {
      if (initialDataLoadedRef.current) return;

      // 빈 버퍼 생성 후 초기 데이터 추가
      const emptyGpuUtil = createRingBuffer<MetricValue>(bufferSize);
      const emptyGpuMem = createRingBuffer<MetricValue>(bufferSize);
      const emptyCpuUtil = createRingBuffer<MetricValue>(bufferSize);
      const emptyMemUtil = createRingBuffer<MetricValue>(bufferSize);

      setBuffers({
        gpuUtilization: pushToRingBuffer(
          emptyGpuUtil,
          data.gpuUtilization.data,
        ),
        gpuMemUtilization: pushToRingBuffer(
          emptyGpuMem,
          data.gpuMemUtilization.data,
        ),
        cpuUtilization: pushToRingBuffer(
          emptyCpuUtil,
          data.cpuUtilization.data,
        ),
        memUtilization: pushToRingBuffer(
          emptyMemUtil,
          data.memUtilization.data,
        ),
      });

      initialDataLoadedRef.current = true;
    },
    [bufferSize],
  );

  return {
    buffers,
    updateBuffers,
    resetBuffers,
    initFromData,
  };
}
