import { useCallback, useRef, useState } from "react";

import { DEFAULT_BUFFER_SIZE } from "@/domain/user-monitoring/constants/workspace-monitoring.constant";
import type { ChartDataSeries } from "@/shared/utils/chart.util";

interface UseWorkspaceMetricBufferParams {
  bufferSize?: number;
}

interface UseWorkspaceMetricBufferReturn {
  updateBuffer: (newData: ChartDataSeries[]) => void;
  initFromData: (initialData: ChartDataSeries[]) => void;
  resetBuffer: () => void;
  toChartSeries: () => ChartDataSeries[];
  updateTick: number;
}

export function useWorkspaceMetricBuffer({
  bufferSize = DEFAULT_BUFFER_SIZE,
}: UseWorkspaceMetricBufferParams = {}): UseWorkspaceMetricBufferReturn {
  const bufferRef = useRef<{ x: Date; y: number }[]>([]);
  const seriesNameRef = useRef<string>("");
  const [updateTick, setUpdateTick] = useState(0);

  const initFromData = useCallback(
    (initialData: ChartDataSeries[]) => {
      if (!initialData?.[0]) {
        bufferRef.current = [];
        seriesNameRef.current = "";
        setUpdateTick((prev) => prev + 1);
        return;
      }

      const data = initialData[0].data;
      bufferRef.current =
        data.length > bufferSize
          ? data.slice(data.length - bufferSize)
          : [...data];
      seriesNameRef.current = initialData[0].name;
      setUpdateTick((prev) => prev + 1);
    },
    [bufferSize],
  );

  const updateBuffer = useCallback(
    (newData: ChartDataSeries[]) => {
      if (!newData?.[0]?.data || newData[0].data.length === 0) return;

      const currentBuffer = bufferRef.current;
      const newPoints = newData[0].data;

      const byTimestamp = new Map<number, { x: Date; y: number }>();
      newPoints.forEach((point) => {
        byTimestamp.set(point.x.getTime(), point);
      });
      currentBuffer.forEach((point) => {
        const timestamp = point.x.getTime();
        if (!byTimestamp.has(timestamp)) {
          byTimestamp.set(timestamp, point);
        }
      });

      const mergedPoints = Array.from(byTimestamp.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([, point]) => point);

      const finalBuffer =
        mergedPoints.length > bufferSize
          ? mergedPoints.slice(mergedPoints.length - bufferSize)
          : mergedPoints;

      const isSameBuffer =
        finalBuffer.length === currentBuffer.length &&
        finalBuffer.every((point, index) => {
          const existingPoint = currentBuffer[index];
          return (
            point.x.getTime() === existingPoint.x.getTime() &&
            point.y === existingPoint.y
          );
        });

      if (isSameBuffer) return;

      bufferRef.current = finalBuffer;
      seriesNameRef.current = newData[0].name;
      setUpdateTick((prev) => prev + 1);
    },
    [bufferSize],
  );

  const resetBuffer = useCallback(() => {
    bufferRef.current = [];
    seriesNameRef.current = "";
    setUpdateTick(0);
  }, []);

  const toChartSeries = useCallback((): ChartDataSeries[] => {
    if (!seriesNameRef.current) return [];

    return [
      {
        type: "area",
        name: seriesNameRef.current,
        data: [...bufferRef.current],
      },
    ];
  }, []);

  return {
    updateBuffer,
    initFromData,
    resetBuffer,
    toChartSeries,
    updateTick,
  };
}
