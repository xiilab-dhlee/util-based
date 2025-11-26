"use client";

import styled from "styled-components";

import { SystemMonitoringCard } from "@/domain/system-monitoring/components/system-monitoring-card";
import type { MonitoringDateMode } from "@/shared/types/monitoring.type";

interface SystemMonitoringChartListProps {
  nodeName: string;
  /** history 모드에서 사용할 날짜 범위 */
  dateRange: { start: Date; end: Date };
  selectedGpu: string[] | undefined;
  /** 현재 날짜 모드: live | history */
  mode: MonitoringDateMode;
  /**
   * 차트에서 드래그로 선택된 구간을 상위로 전달하는 핸들러
   * - LIVE 모드에서도 호출되며, 상위에서 history 모드 전환 여부를 결정합니다.
   */
  onChangeRangeFromChart?: (range: { start: Date; end: Date }) => void;
}

export function SystemMonitoringChartList({
  nodeName,
  dateRange,
  selectedGpu,
  mode,
  onChangeRangeFromChart,
}: SystemMonitoringChartListProps) {
  return (
    <ChartArticle>
      {/* ========== GPU 메트릭 (5개) ========== */}
      <ChartSingleRow>
        <SystemMonitoringCard
          type="gpu-utilization"
          nodeName={nodeName}
          mode={mode}
          dateRange={dateRange}
          selectedGpu={selectedGpu}
          onSelectRange={onChangeRangeFromChart}
        />
      </ChartSingleRow>

      <ChartMultiRow>
        <SystemMonitoringCard
          type="gpu-memory"
          nodeName={nodeName}
          mode={mode}
          dateRange={dateRange}
          selectedGpu={selectedGpu}
          onSelectRange={onChangeRangeFromChart}
        />
        <SystemMonitoringCard
          type="gpu-temperature"
          nodeName={nodeName}
          mode={mode}
          dateRange={dateRange}
          selectedGpu={selectedGpu}
          onSelectRange={onChangeRangeFromChart}
        />
      </ChartMultiRow>

      <ChartMultiRow>
        <SystemMonitoringCard
          type="gpu-fan-speed"
          nodeName={nodeName}
          mode={mode}
          dateRange={dateRange}
          selectedGpu={selectedGpu}
          onSelectRange={onChangeRangeFromChart}
        />
        <SystemMonitoringCard
          type="gpu-power-usage"
          nodeName={nodeName}
          mode={mode}
          dateRange={dateRange}
          selectedGpu={selectedGpu}
          onSelectRange={onChangeRangeFromChart}
        />
      </ChartMultiRow>

      {/* ========== CPU 메트릭 (4개) ========== */}
      <ChartMultiRow>
        <SystemMonitoringCard
          type="cpu-utilization"
          nodeName={nodeName}
          mode={mode}
          dateRange={dateRange}
          onSelectRange={onChangeRangeFromChart}
        />
        <SystemMonitoringCard
          type="cpu-temperature"
          nodeName={nodeName}
          mode={mode}
          dateRange={dateRange}
          onSelectRange={onChangeRangeFromChart}
        />
      </ChartMultiRow>

      <ChartMultiRow>
        <SystemMonitoringCard
          type="cpu-load-average"
          nodeName={nodeName}
          mode={mode}
          dateRange={dateRange}
          onSelectRange={onChangeRangeFromChart}
        />
        <SystemMonitoringCard
          type="network-rt"
          nodeName={nodeName}
          mode={mode}
          dateRange={dateRange}
          onSelectRange={onChangeRangeFromChart}
        />
      </ChartMultiRow>

      {/* ========== Memory 메트릭  ========== */}
      <ChartMultiRow>
        <SystemMonitoringCard
          type="memory-utilization"
          nodeName={nodeName}
          mode={mode}
          dateRange={dateRange}
          onSelectRange={onChangeRangeFromChart}
        />
        <SystemMonitoringCard
          type="memory-detail"
          nodeName={nodeName}
          mode={mode}
          dateRange={dateRange}
          onSelectRange={onChangeRangeFromChart}
        />
      </ChartMultiRow>

      {/* ========== Disk 메트릭  ========== */}
      <ChartMultiRow>
        <SystemMonitoringCard
          type="disk-utilization"
          nodeName={nodeName}
          mode={mode}
          dateRange={dateRange}
          onSelectRange={onChangeRangeFromChart}
        />
        <SystemMonitoringCard
          type="disk-rw"
          nodeName={nodeName}
          mode={mode}
          dateRange={dateRange}
          onSelectRange={onChangeRangeFromChart}
        />
      </ChartMultiRow>
    </ChartArticle>
  );
}

const ChartSingleRow = styled.div`
  height: 390px;
  margin-bottom: 10px;
`;

const ChartMultiRow = styled.div`
  height: 390px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 10px;
`;

const ChartArticle = styled.article`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
`;
