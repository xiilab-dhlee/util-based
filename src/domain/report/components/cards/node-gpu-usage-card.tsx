"use client";

import type { ReactNode } from "react";

import { GPU_CHART_COLORS } from "@/domain/monitoring/utils/monitoring.util";
import { GpuInfoSection } from "@/domain/report/components/cards/gpu-info-section";
import { CustomReportCard } from "@/shared/components/card/custom-report-card";

interface NodeGpuUsageCardProps {
  /** 노드 명 (예: "Worker-1") */
  nodeName: string;
  /** GPU 모델 (예: "A100") */
  gpuModel: string;
  /** 평균 사용률 퍼센티지 */
  percentage: number;
  /** 차트 컴포넌트 */
  chart?: ReactNode;
  /** 색상 인덱스 (노드별 색상 구분용) */
  colorIndex?: number;
}

/**
 * 노드별 GPU 사용률 카드 컴포넌트
 * GPU 정보 + 프로그레스 바 + 차트를 포함한 카드
 */
export function NodeGpuUsageCard({
  nodeName,
  gpuModel,
  percentage,
  chart,
  colorIndex = 0,
}: NodeGpuUsageCardProps) {
  // colorIndex로 색상 선택 (배열 길이로 나눠 순환)
  const nodeColor = GPU_CHART_COLORS[colorIndex % GPU_CHART_COLORS.length];

  const content = [
    {
      title: "노드별 GPU 사용률",
      content: (
        <GpuInfoSection
          nodeName={nodeName}
          gpuModel={gpuModel}
          percentage={percentage}
          color={nodeColor}
        />
      ),
    },
    {
      title: `${nodeName} GPU 사용률 추이`,
      content: chart,
    },
  ];
  return <CustomReportCard sections={content} />;
}
