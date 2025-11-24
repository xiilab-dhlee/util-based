"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

import type { ChartDataSeries } from "@/shared/utils/chart.util";
import { statusTextStyle } from "@/styles/mixins/text";

interface ChartLegendToggleProps {
  /** 차트 시리즈 데이터 */
  series: ChartDataSeries[];
  /** 시리즈별 색상 배열 */
  colors: string[];
  /**
   * 시리즈 토글 시 콜백 (선택사항)
   * - Legend는 내부 active 상태만 관리하고
   * - 실제 ApexCharts 인스턴스 제어는 상위 컴포넌트에서 수행합니다.
   */
  onToggle?: (seriesName: string, isActive: boolean) => void;
}

/**
 * ApexCharts용 범례 토글 컴포넌트
 *
 * 차트 시리즈를 표시하고 클릭하여 show/hide할 수 있는 범례를 제공합니다.
 */
export function ChartLegendToggle({
  series,
  colors,
  onToggle,
}: ChartLegendToggleProps) {
  const [activeSeriesMap, setActiveSeriesMap] = useState<
    Record<string, boolean>
  >({});

  // 시리즈가 변경될 때마다 active 상태 초기화
  useEffect(() => {
    setActiveSeriesMap((prev) => {
      const next: Record<string, boolean> = {};

      series.forEach((item) => {
        const key = item.name;
        // 기존 상태 유지, 없으면 기본값 true
        next[key] = prev[key] ?? true;
      });

      return next;
    });
  }, [series]);

  const handleToggle = (seriesName: string) => {
    const currentActive = activeSeriesMap[seriesName] ?? true;
    const nextActive = !currentActive;

    setActiveSeriesMap((prev) => ({
      ...prev,
      [seriesName]: nextActive,
    }));
    // 상위에서 실제 차트 인스턴스를 제어하도록 위임
    onToggle?.(seriesName, nextActive);
  };

  if (series.length === 0) {
    return null;
  }

  return (
    <Legend>
      {series.map((item, index) => {
        const isActive = activeSeriesMap[item.name] ?? true;
        const color = colors[index % colors.length];

        return (
          <Series
            key={`${item.name}-${index}`}
            onClick={() => handleToggle(item.name)}
          >
            <SeriesText color={color} $active={isActive}>
              {item.name}
            </SeriesText>
          </Series>
        );
      })}
    </Legend>
  );
}

const Legend = styled.div`
  margin: 0 20px 8px 20px;
  background-color: #f7f9fb;
  border: 1px solid #d1d5dc;
  height: 30px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const Series = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  & + & {
    border-left: 1px solid #d1d5dc;
  }
`;

const SeriesText = styled.span<{ color: string; $active: boolean }>`
  ${statusTextStyle(6)}

  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: ${({ $active }) => ($active ? "#313131" : "#b0b0b0")};
  margin-left: 9px;
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};

  &::before {
    background-color: ${({ color }) => color};
    opacity: ${({ $active }) => ($active ? 1 : 0.3)};
  }
`;
