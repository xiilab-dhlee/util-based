"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SeriesVisibilityMap = Record<string, Record<string, boolean>>;

interface UseSeriesVisibilityParams {
  nodeName: string;
}

interface UseSeriesVisibilityReturn {
  visibilityMap: SeriesVisibilityMap;
  toggleSeries: (
    metricType: string,
    seriesName: string,
    isActive: boolean,
  ) => void;
  getVisibilityForMetric: (metricType: string) => Record<string, boolean>;
  resetVisibility: () => void;
}

export function useSeriesVisibility({
  nodeName,
}: UseSeriesVisibilityParams): UseSeriesVisibilityReturn {
  const [visibilityMap, setVisibilityMap] = useState<SeriesVisibilityMap>({});
  const prevNodeNameRef = useRef(nodeName);

  const resetVisibility = useCallback(() => {
    setVisibilityMap({});
  }, []);

  useEffect(() => {
    if (prevNodeNameRef.current !== nodeName) {
      resetVisibility();
      prevNodeNameRef.current = nodeName;
    }
  }, [nodeName, resetVisibility]);

  const toggleSeries = useCallback(
    (metricType: string, seriesName: string, isActive: boolean) => {
      setVisibilityMap((prev) => ({
        ...prev,
        [metricType]: {
          ...prev[metricType],
          [seriesName]: isActive,
        },
      }));
    },
    [],
  );

  const getVisibilityForMetric = useCallback(
    (metricType: string): Record<string, boolean> => {
      return visibilityMap[metricType] ?? {};
    },
    [visibilityMap],
  );

  return {
    visibilityMap,
    toggleSeries,
    getVisibilityForMetric,
    resetVisibility,
  };
}
