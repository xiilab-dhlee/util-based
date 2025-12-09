"use client";

import type { ReactNode } from "react";

import { CustomReportCard } from "@/shared/components/card/custom-report-card";
import { GpuInfoSection } from "./gpu-info-section";

interface NodeGpuUsageCardProps {
  /** 노드 명 (예: "Worker-1") */
  nodeName: string;
  /** GPU 모델 (예: "A100") */
  gpuModel: string;
  /** 평균 사용률 퍼센티지 */
  percentage: number;
  /** 차트 컴포넌트 */
  chart?: ReactNode;
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
}: NodeGpuUsageCardProps) {
  const content = [
    {
      title: "노드별 GPU 사용률",
      content: (
        <GpuInfoSection
          nodeName={nodeName}
          gpuModel={gpuModel}
          percentage={percentage}
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
