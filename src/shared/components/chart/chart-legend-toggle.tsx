"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import type { ChartDataSeries } from "@/shared/utils/chart.util";
import { statusTextStyle } from "@/styles/mixins/text";

interface ChartLegendToggleProps {
  series: ChartDataSeries[];
  colors: string[] | readonly string[];
  activeSeriesMap?: Record<string, boolean>;
  onToggle?: (seriesName: string, isActive: boolean) => void;
}

const DEFAULT_COLOR = "#8a8a8a";

export function ChartLegendToggle({
  series,
  colors,
  activeSeriesMap: externalActiveMap,
  onToggle,
}: ChartLegendToggleProps) {
  const [internalActiveMap, setInternalActiveMap] = useState<
    Record<string, boolean>
  >({});
  const internalActiveMapRef = useRef<Record<string, boolean>>({});

  const isControlled = externalActiveMap !== undefined;
  const activeMap = isControlled ? externalActiveMap : internalActiveMap;

  useEffect(() => {
    if (isControlled) return;

    const prev = internalActiveMapRef.current;
    const next: Record<string, boolean> = {};
    for (const item of series) {
      next[item.name] = prev[item.name] ?? true;
    }
    internalActiveMapRef.current = next;
    setInternalActiveMap(next);
  }, [series, isControlled]);

  useEffect(() => {
    if (series.length > 0 && colors.length === 0) {
      console.warn(
        "ChartLegendToggle: colors is empty. Falling back to DEFAULT_COLOR.",
      );
    }
  }, [series.length, colors.length]);

  const handleToggle = (seriesName: string) => {
    const nextActive = !(activeMap[seriesName] ?? true);

    if (!isControlled) {
      internalActiveMapRef.current = {
        ...internalActiveMapRef.current,
        [seriesName]: nextActive,
      };
      setInternalActiveMap((prev) => ({ ...prev, [seriesName]: nextActive }));
    }

    onToggle?.(seriesName, nextActive);
  };

  if (series.length === 0) return null;

  const hasColors = colors.length > 0;

  return (
    <Legend>
      {series.map((item, index) => (
        <Series
          key={`${item.name}-${index}`}
          onClick={() => handleToggle(item.name)}
        >
          <SeriesText
            color={hasColors ? colors[index % colors.length] : DEFAULT_COLOR}
            $active={activeMap[item.name] ?? true}
          >
            {item.name}
          </SeriesText>
        </Series>
      ))}
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
