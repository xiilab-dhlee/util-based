import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { ReportDetailResponse } from "@/domain/report/schemas/report.schema";
import { findMinMax } from "@/domain/report/utils/chart/min-max.util";
import { MonitoringChart } from "@/shared/components/chart/monitoring-chart";
import type { CoreResourceType } from "@/shared/types/core.interface";
import { getResourceInfo } from "@/shared/utils/resource.util";

interface ResourceUsageTrendChartsProps {
  resourceTrends: ReportDetailResponse["resourceTrends"];
}

// 리소스 색상 타입 정의
type ResourceColorScheme = {
  total: string;
  requested: string;
  used: string;
};

// CSS 변수에서 리소스별 색상 가져오기
const getResourceColors = (
  type: CoreResourceType,
  baseColor: string,
): ResourceColorScheme => {
  const colorMap: Record<CoreResourceType, ResourceColorScheme> = {
    GPU: {
      total: baseColor,
      requested: "var(--gpu-request-color)",
      used: "var(--gpu-usage-color)",
    },
    CPU: {
      total: baseColor,
      requested: "var(--cpu-request-color)",
      used: "var(--cpu-usage-color)",
    },
    MEM: {
      total: baseColor,
      requested: "var(--mem-request-color)",
      used: "var(--mem-usage-color)",
    },
    DISK: {
      total: baseColor,
      requested: "var(--disk-request-color)",
      used: "var(--disk-usage-color)",
    },
    MIG: {
      total: baseColor,
      requested: "var(--gpu-request-color)",
      used: "var(--gpu-usage-color)",
    },
    MPS: {
      total: baseColor,
      requested: "var(--gpu-request-color)",
      used: "var(--gpu-usage-color)",
    },
  };

  return (
    colorMap[type] || {
      total: baseColor,
      requested: "#5F84FF",
      used: baseColor,
    }
  );
};

export function ResourceUsageTrendCharts({
  resourceTrends,
}: ResourceUsageTrendChartsProps) {
  return (
    <ChartsWrapper>
      {resourceTrends.map((trend) => {
        const { text, unit, color } = getResourceInfo(trend.type);
        const colors = getResourceColors(trend.type, color);

        // 차트 시리즈 데이터 구성
        const series = [
          {
            name: "전체 용량",
            data: trend.data.map((d) => ({
              x: new Date(d.timestamp).getTime(),
              y: d.total,
            })),
            color: colors.total,
          },
          {
            name: "할당량",
            data: trend.data.map((d) => ({
              x: new Date(d.timestamp).getTime(),
              y: d.requested,
            })),
            color: colors.requested,
          },
          {
            name: "사용량",
            data: trend.data.map((d) => ({
              x: new Date(d.timestamp).getTime(),
              y: d.used,
            })),
            color: colors.used,
          },
        ] as {
          name: string;
          data: { x: number; y: number }[];
          color: string;
        }[];

        const seriesIndices = [
          {
            index: 0,
            data: findMinMax(trend.data, (d) => d.total),
            color: colors.total,
          },
          {
            index: 1,
            data: findMinMax(trend.data, (d) => d.requested),
            color: colors.requested,
          },
          {
            index: 2,
            data: findMinMax(trend.data, (d) => d.used),
            color: colors.used,
          },
        ];

        // discrete 마커 생성 헬퍼 함수
        const createDiscreteMarker = (
          seriesIndex: number,
          dataPointIndex: number,
          fillColor: string,
        ) => ({
          seriesIndex,
          dataPointIndex,
          fillColor,
          strokeColor: "#fff",
          size: 8,
          strokeWidth: 3,
        });

        // 커스텀 차트 옵션: 세로 그리드와 각 시리즈별 최소/최대값 마커
        const customChartOptions = {
          grid: {
            xaxis: {
              lines: {
                show: true, // 세로 그리드 라인 표시
              },
            },
          },
          markers: {
            size: 0, // 기본 마커는 표시하지 않음
            discrete: seriesIndices.flatMap(({ index, data, color }) => {
              const markers = [];
              if (data.minIndex >= 0) {
                markers.push(createDiscreteMarker(index, data.minIndex, color));
              }
              if (data.maxIndex >= 0 && data.maxIndex !== data.minIndex) {
                markers.push(createDiscreteMarker(index, data.maxIndex, color));
              }
              return markers;
            }),
          },
          dataLabels: {
            enabled: false, // 기본 dataLabels 비활성화
          },
          annotations: {
            points: seriesIndices.flatMap(({ index, data, color }) => {
              const seriesData = series[index]?.data;
              if (!seriesData) return [];

              const annotations = [];

              // 최소값 annotation
              if (seriesData[data.minIndex]) {
                annotations.push({
                  x: seriesData[data.minIndex].x,
                  y: seriesData[data.minIndex].y,
                  label: {
                    text: `최소: ${seriesData[data.minIndex].y}${unit}`,
                    style: {
                      background: color,
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#ffffff",
                      padding: {
                        left: 4,
                        right: 4,
                        top: 4,
                        bottom: 4,
                      },
                    },
                    offsetY: -8,
                    borderWidth: 0,
                  },
                });
              }

              // 최대값 annotation
              if (
                seriesData[data.maxIndex] &&
                data.minIndex !== data.maxIndex
              ) {
                annotations.push({
                  x: seriesData[data.maxIndex].x,
                  y: seriesData[data.maxIndex].y,
                  label: {
                    text: `최대: ${seriesData[data.maxIndex].y}${unit}`,
                    style: {
                      background: color,
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#ffffff",
                      padding: {
                        left: 4,
                        right: 4,
                        top: 4,
                        bottom: 4,
                      },
                    },
                    offsetY: -8,
                    borderWidth: 0,
                  },
                });
              }

              return annotations;
            }),
          },
          tooltip: {
            shared: true,
            intersect: false,
          },
          yaxis: {
            min: (min: number) => {
              // Y축 최소값을 데이터 최소값보다 약간 작게 설정하여 여유 공간 확보
              return Math.floor(min * 0.95);
            },
            max: (max: number) => {
              // Y축 최대값을 데이터 최대값보다 약간 크게 설정하여 여유 공간 확보
              return Math.ceil(max * 1.05);
            },
          },
        };
        const cardTitle = `${text}(${unit}) - 리소스 사용량 추이`;

        return (
          <Card
            key={trend.type}
            hoverable={false}
            title={cardTitle}
            contentVariant="compact"
            actionElement={
              <LegendContainer>
                <LegendItem>
                  <LegendDot $color={colors.total} />
                  <LegendLabel>전체 용량</LegendLabel>
                </LegendItem>
                <LegendItem>
                  <LegendDot $color={colors.requested} />
                  <LegendLabel>할당량</LegendLabel>
                </LegendItem>
                <LegendItem>
                  <LegendDot $color={colors.used} />
                  <LegendLabel>사용량</LegendLabel>
                </LegendItem>
              </LegendContainer>
            }
          >
            <CardBody>
              <MonitoringChart
                series={series}
                height={300}
                unit={unit}
                chartType="line"
                customOptions={customChartOptions}
                chartId={`resource-trend-${trend.type}`}
              />
            </CardBody>
          </Card>
        );
      })}
    </ChartsWrapper>
  );
}

const ChartsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const LegendContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const LegendItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const LegendDot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
`;

const LegendLabel = styled.span`
  font-size: 12px;
  color: #666666;
`;
