"use client";

import type ApexCharts from "apexcharts";
import { useCallback, useState } from "react";

/**
 * ApexCharts 인스턴스 관리 및 범례 토글 기능을 제공하는 훅
 *
 * @returns 차트 인스턴스 관련 상태 및 핸들러
 *
 * @example
 * const { chartInstance, handleChartReady, handleLegendToggle } = useChartInstance();
 *
 * <MonitoringChart onChartReady={handleChartReady} ... />
 * <ChartLegendToggle onToggle={handleLegendToggle} ... />
 */
export function useChartInstance() {
  const [chartInstance, setChartInstance] = useState<ApexCharts | null>(null);

  /**
   * 차트가 마운트되었을 때 호출되는 핸들러
   * MonitoringChart의 onChartReady prop에 전달
   */
  const handleChartReady = useCallback((chart: unknown) => {
    setChartInstance(chart as ApexCharts);
  }, []);

  /**
   * 범례 토글 핸들러
   * ChartLegendToggle의 onToggle prop에 전달
   *
   * @param seriesName - 토글할 시리즈 이름
   * @param isActive - 활성화 여부
   */
  const handleLegendToggle = useCallback(
    (seriesName: string, isActive: boolean) => {
      if (!chartInstance) return;

      if (isActive) {
        chartInstance.showSeries(seriesName);
      } else {
        chartInstance.hideSeries(seriesName);
      }
    },
    [chartInstance],
  );

  return {
    /** ApexCharts 인스턴스 */
    chartInstance,
    /** 차트 마운트 핸들러 */
    handleChartReady,
    /** 범례 토글 핸들러 */
    handleLegendToggle,
  };
}
