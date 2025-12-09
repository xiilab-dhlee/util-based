"use client";

import type { ApexOptions } from "apexcharts";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { MonitoringChart } from "@/shared/components/chart/monitoring-chart";
import { getResourceInfo } from "@/shared/utils/resource.util";

interface NodeGpuChartProps {
  nodeName: string;
  data?: Array<{
    name: string;
    data: Array<{ x: string; y: number }>;
  }>;
}

/**
 * 노드 GPU 사용률 추이 차트
 */
export function NodeGpuChart({ nodeName, data }: NodeGpuChartProps) {
  const gpuInfo = getResourceInfo("GPU");

  // Mock 데이터 (실제로는 props로 받아야 함)
  const mockSeries: ApexOptions["series"] = data || [
    {
      name: "A100-0",
      data: [
        { x: "03.01", y: 44 },
        { x: "03.02", y: 23 },
        { x: "03.03", y: 32 },
        { x: "03.04", y: 75 },
        { x: "03.05", y: 72 },
        { x: "03.06", y: 76 },
        { x: "03.07", y: 73 },
        { x: "03.08", y: 48 },
        { x: "03.09", y: 52 },
      ],
    },
    {
      name: "A100-1",
      data: [
        { x: "03.01", y: 65 },
        { x: "03.02", y: 68 },
        { x: "03.03", y: 70 },
        { x: "03.04", y: 75 },
        { x: "03.05", y: 76 },
        { x: "03.06", y: 79 },
        { x: "03.07", y: 77 },
        { x: "03.08", y: 72 },
        { x: "03.09", y: 68 },
      ],
    },
    {
      name: "A100-2",
      data: [
        { x: "03.01", y: 35 },
        { x: "03.02", y: 38 },
        { x: "03.03", y: 42 },
        { x: "03.04", y: 48 },
        { x: "03.05", y: 52 },
        { x: "03.06", y: 55 },
        { x: "03.07", y: 51 },
        { x: "03.08", y: 45 },
        { x: "03.09", y: 42 },
      ],
    },
  ];

  const colors = [
    "#376DFF", // 파랑
    gpuInfo.color, // GPU 색상 (보라)
    "#55D398", // 초록
    "#F5B849", // 노랑
    "#FF6B6B", // 빨강
    "#4ECDC4", // 청록
    "#95E1D3", // 민트
    "#F38181", // 연분홍
    "#AA96DA", // 연보라
  ];

  return (
    <Container>
      <ChartTitle>{nodeName} GPU 사용률 추이</ChartTitle>
      <MonitoringChart
        series={mockSeries}
        height={300}
        unit="%"
        colors={colors}
        chartType="line"
        chartId={`${nodeName}-gpu-chart`}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChartTitle = styled(Typography.Text).attrs({
  variant: "subtitle-2-1",
})`
  color: #191b26;
`;
