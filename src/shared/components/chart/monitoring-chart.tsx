"use client";

import type { ApexOptions } from "apexcharts";
import ko from "apexcharts/dist/locales/ko.json";
import { merge } from "es-toolkit/compat";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";

import { buildMonitoringChartOptions } from "@/shared/components/chart/monitoring-chart-options";
import { MySpinner } from "@/shared/components/spinner";

interface MonitoringChartProps {
  series: ApexOptions["series"];
  height?: number;
  width?: number | string;
  unit: string;
  colors?: string[];
  /** 로딩 상태 여부 (true면 스피너 표시) */
  isLoading?: boolean;
  /** 에러 상태 여부 (true면 에러 상태로 간주) */
  isError?: boolean;
  /** 외부에서 시리즈 토글 등을 제어하기 위한 ApexCharts chart id */
  chartId?: string;
  /** 차트 타입 (line, bar, area 등) */
  chartType?: "line" | "bar" | "area";
  /**
   * ApexCharts 인스턴스가 마운트되었을 때 호출되는 콜백
   * - Legend 등에서 Apex 인스턴스를 직접 제어할 때 사용합니다.
   */
  onChartReady?: (chart: unknown) => void;
  /**
   * 차트에서 드래그로 선택된 x축 구간을 상위로 전달하는 콜백
   * - selection 이벤트에서 호출됩니다.
   */
  onSelectRange?: (range: { start: Date; end: Date }) => void;
  /**
   * 커스텀 ApexCharts 옵션
   * - 기본 옵션에 병합되어 적용됩니다.
   */
  customOptions?: ApexOptions;
}

export function MonitoringChart({
  series,
  height,
  width,
  unit,
  colors,
  isLoading,
  isError = false,
  chartId = "monitoring-chart",
  chartType = "area",
  onChartReady,
  onSelectRange,
  customOptions,
}: MonitoringChartProps) {
  /**
   * ApexCharts 인스턴스를 보관하는 ref
   * - React 리렌더와 무관하게 동일 인스턴스를 재사용하기 위해 사용합니다.
   */
  const chartRef = useRef<{
    updateSeries?: (
      nextSeries: ApexOptions["series"],
      animate?: boolean,
    ) => void;
  } | null>(null);

  /**
   * ReactApexChart에 전달할 초기 series
   * - 이후 데이터 변경은 Apex 인스턴스의 updateSeries로만 처리합니다.
   * - 이렇게 하면 React 측의 series prop 변경으로 인한 차트 재마운트를 피할 수 있습니다.
   */
  const initialSeriesRef = useRef<ApexOptions["series"] | null>(null);
  if (!initialSeriesRef.current) {
    initialSeriesRef.current = series;
  }

  /**
   * ApexCharts mounted 이벤트 핸들러
   * - 내부적으로 chartRef에 인스턴스를 저장하고
   * - 외부에서 전달된 onChartReady도 그대로 호출합니다.
   */
  const handleChartMounted = useCallback(
    (chart: unknown) => {
      chartRef.current = chart as {
        updateSeries?: (
          nextSeries: ApexOptions["series"],
          animate?: boolean,
        ) => void;
      };

      onChartReady?.(chart);
    },
    [onChartReady],
  );

  /**
   * ApexOptions 생성
   * - unit / colors / chartId / chartType / onSelectRange / customOptions 등이 바뀔 때만 재생성합니다.
   * - locales, defaultLocale는 여기서 함께 주입합니다.
   * - customOptions는 es-toolkit의 merge를 사용하여 깊은 병합됩니다.
   * - 필수 필드(chart.id, chart.events.mounted, chart.events.selection, chart.events.zoomed)는 보호됩니다.
   */
  const options = useMemo(() => {
    const baseOptions = buildMonitoringChartOptions({
      unit,
      colors,
      chartId,
      chartType,
      onChartReady: handleChartMounted,
      onSelectRange,
    });

    // lodash.merge를 사용하여 깊은 병합 수행
    const merged = customOptions
      ? merge({}, baseOptions, customOptions)
      : baseOptions;

    // 필수 필드 보호: 컴포넌트 동작에 필수적인 필드들은 항상 기본값 유지
    if (merged.chart) {
      // chart.id는 항상 보호 (차트 인스턴스 식별에 필수)
      merged.chart.id = baseOptions.chart?.id ?? merged.chart.id;

      // chart.events의 필수 이벤트 보호
      if (merged.chart.events && baseOptions.chart?.events) {
        // mounted 이벤트는 항상 보호 (chartRef 저장 및 onChartReady 호출에 필수)
        if (baseOptions.chart.events.mounted) {
          merged.chart.events.mounted = baseOptions.chart.events.mounted;
        }
        // selection/zoomed 이벤트는 onSelectRange가 있을 때만 보호
        if (onSelectRange) {
          if (baseOptions.chart.events.selection) {
            merged.chart.events.selection = baseOptions.chart.events.selection;
          }
          if (baseOptions.chart.events.zoomed) {
            merged.chart.events.zoomed = baseOptions.chart.events.zoomed;
          }
        }
      }
    }

    // selection 객체는 onSelectRange가 있을 때만 보호
    if (onSelectRange && baseOptions.selection) {
      merged.selection = baseOptions.selection;
    }

    // locales와 defaultLocale은 항상 주입
    merged.locales = [ko];
    merged.defaultLocale = "ko";

    return merged as ApexOptions;
  }, [
    unit,
    colors,
    chartId,
    chartType,
    handleChartMounted,
    onSelectRange,
    customOptions,
  ]);

  /**
   * series 변경 시 ApexCharts 인스턴스에만 데이터 반영
   * - ReactApexChart 컴포넌트는 재마운트하지 않고,
   *   내부 시리즈 데이터만 교체하여 툴팁/드래그 상태가 유지되도록 합니다.
   */
  useEffect(() => {
    if (!chartRef.current?.updateSeries) {
      return;
    }

    chartRef.current.updateSeries(series, false);
  }, [series]);

  const hasSeries = Array.isArray(series) && series?.length > 0;

  const shouldShowError = !isLoading && isError;
  const shouldShowEmpty = !isLoading && !isError && !hasSeries;

  return (
    <ChartContainer $height={height} $width={width}>
      <DynamicApexChart
        options={options}
        series={initialSeriesRef.current ?? series}
        type={chartType}
        width={width || "100%"}
        height={height || "100%"}
      />

      {isLoading && (
        <Overlay>
          <MySpinner />
        </Overlay>
      )}

      {shouldShowError && (
        <Overlay>
          <OverlayMessage>데이터를 불러 올 수 없습니다.</OverlayMessage>
        </Overlay>
      )}

      {shouldShowEmpty && (
        <Overlay>
          <OverlayMessage>데이터가 없습니다.</OverlayMessage>
        </Overlay>
      )}
    </ChartContainer>
  );
}

const DynamicApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ChartContainer = styled.div<{
  $height?: number;
  $width?: number | string;
}>`
  position: relative;
  width: ${({ $width }) => {
    if (typeof $width === "number") return `${$width}px`;
    if (typeof $width === "string") return $width;
    return "100%";
  }};
  height: ${({ $height }) => ($height ? `${$height}px` : "100%")};
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 900;
`;

const OverlayMessage = styled.span`
  color: #666666;
  font-size: 14px;
`;
