"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { GetNodeSystemMetricsMetricsItem } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { DEFAULT_BUFFER_SIZE } from "@/domain/system-monitoring/constants/system-monitoring.constant";
import type {
  MetricValue,
  SystemMetricBuffers,
  SystemMetricSeriesGroup,
} from "@/domain/system-monitoring/types/metrics.type";
import {
  createRingBuffer,
  pushToRingBuffer,
} from "@/domain/system-monitoring/utils/ring-buffer.util";

interface UseSystemMetricBuffersParams {
  /** 버퍼 최대 크기 */
  bufferSize?: number;
  /** 노드명 (변경 시 버퍼 리셋) */
  nodeName: string;
}

interface UseSystemMetricBuffersReturn {
  /** 현재 버퍼 상태 */
  buffers: SystemMetricBuffers;
  /** 버퍼 업데이트 (새 데이터 추가) */
  updateBuffers: (data: Partial<BufferUpdateData>) => void;
  /** 버퍼 리셋 */
  resetBuffers: () => void;
  /** 초기 데이터로 버퍼 설정 */
  initFromData: (data: SystemMetricSeriesGroup) => void;
}

interface BufferUpdateData {
  cpuUtilization: MetricValue[];
  cpuTemperature: MetricValue[];
  memoryUtilization: MetricValue[];
  diskUtilization: MetricValue[];
  diskRead: MetricValue[];
  diskWrite: MetricValue[];
}

/**
 * 빈 버퍼 세트 생성
 */
function createEmptyBuffers(bufferSize: number): SystemMetricBuffers {
  return {
    cpuUtilization: createRingBuffer(bufferSize),
    cpuTemperature: createRingBuffer(bufferSize),
    memoryUtilization: createRingBuffer(bufferSize),
    diskUtilization: createRingBuffer(bufferSize),
    diskRead: createRingBuffer(bufferSize),
    diskWrite: createRingBuffer(bufferSize),
  };
}

/**
 * 시스템 메트릭 버퍼 관리 훅
 *
 * SSE 스트리밍 데이터를 링 버퍼로 관리합니다:
 * - 버퍼 생성/리셋
 * - 데이터 추가 (FIFO)
 * - 초기 데이터 로드
 *
 * @example
 * const { buffers, updateBuffers, initFromData } = useSystemMetricBuffers({
 *   bufferSize: 5000,
 *   nodeName: "node-1",
 * });
 *
 * initFromData(historyData);
 * updateBuffers({ cpuUtilization: newCpuData, memoryUtilization: newMemData });
 */
export function useSystemMetricBuffers({
  bufferSize = DEFAULT_BUFFER_SIZE,
  nodeName,
}: UseSystemMetricBuffersParams): UseSystemMetricBuffersReturn {
  const [buffers, setBuffers] = useState<SystemMetricBuffers>(() =>
    createEmptyBuffers(bufferSize),
  );
  const initialDataLoadedRef = useRef(false);
  const prevNodeNameRef = useRef(nodeName);

  const resetBuffers = useCallback(() => {
    setBuffers(createEmptyBuffers(bufferSize));
    initialDataLoadedRef.current = false;
  }, [bufferSize]);

  useEffect(() => {
    if (prevNodeNameRef.current !== nodeName) {
      resetBuffers();
      prevNodeNameRef.current = nodeName;
    }
  }, [nodeName, resetBuffers]);

  const updateBuffers = useCallback((data: Partial<BufferUpdateData>) => {
    setBuffers((prev) => ({
      cpuUtilization:
        data.cpuUtilization && data.cpuUtilization.length > 0
          ? pushToRingBuffer(prev.cpuUtilization, data.cpuUtilization)
          : prev.cpuUtilization,
      cpuTemperature:
        data.cpuTemperature && data.cpuTemperature.length > 0
          ? pushToRingBuffer(prev.cpuTemperature, data.cpuTemperature)
          : prev.cpuTemperature,
      memoryUtilization:
        data.memoryUtilization && data.memoryUtilization.length > 0
          ? pushToRingBuffer(prev.memoryUtilization, data.memoryUtilization)
          : prev.memoryUtilization,
      diskUtilization:
        data.diskUtilization && data.diskUtilization.length > 0
          ? pushToRingBuffer(prev.diskUtilization, data.diskUtilization)
          : prev.diskUtilization,
      diskRead:
        data.diskRead && data.diskRead.length > 0
          ? pushToRingBuffer(prev.diskRead, data.diskRead)
          : prev.diskRead,
      diskWrite:
        data.diskWrite && data.diskWrite.length > 0
          ? pushToRingBuffer(prev.diskWrite, data.diskWrite)
          : prev.diskWrite,
    }));
  }, []);

  const initFromData = useCallback(
    (data: SystemMetricSeriesGroup) => {
      if (initialDataLoadedRef.current) return;

      setBuffers({
        cpuUtilization: pushToRingBuffer(
          createRingBuffer(bufferSize),
          data.cpuUtilization.data,
        ),
        cpuTemperature: pushToRingBuffer(
          createRingBuffer(bufferSize),
          data.cpuTemperature.data,
        ),
        memoryUtilization: pushToRingBuffer(
          createRingBuffer(bufferSize),
          data.memoryUtilization.data,
        ),
        diskUtilization: pushToRingBuffer(
          createRingBuffer(bufferSize),
          data.diskUtilization.data,
        ),
        diskRead: pushToRingBuffer(
          createRingBuffer(bufferSize),
          data.diskRw.find(
            (item) =>
              item.metricName === GetNodeSystemMetricsMetricsItem.DISK_READ,
          )?.data ?? [],
        ),
        diskWrite: pushToRingBuffer(
          createRingBuffer(bufferSize),
          data.diskRw.find(
            (item) =>
              item.metricName === GetNodeSystemMetricsMetricsItem.DISK_WRITE,
          )?.data ?? [],
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
