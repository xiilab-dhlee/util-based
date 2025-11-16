"use client";

import type { GpuInstanceRow, GpuModelConfig } from "@/types/node/node.type";
import { GenerateGpuInstance } from "./generate-gpu-instance";

/**
 * GPU 설정을 기반으로 GpuInstanceRow 배열을 생성합니다.
 * 기존 하드코딩된 구조를 동적으로 생성합니다.
 */
function generateRowsFromConfig(config: GpuModelConfig): GpuInstanceRow[] {
  const { configs } = config;

  // 첫 번째 행: 가장 큰 인스턴스 (7g)와 중간 크기 인스턴스들 (4g, 3g)
  const firstRow: GpuInstanceRow = {
    height: 72,
    nodes: [
      {
        type: "node",
        name: `${configs[0].compute}g.${configs[0].memory}gb`,
        gpuIndex: 1,
      },
      {
        type: "column",
        children: [
          {
            type: "node",
            name: `${configs[1].compute}g.${configs[1].memory}gb`,
            gpuIndex: 2,
          },
          {
            type: "column",
            children: [
              {
                type: "node",
                name: `${configs[2].compute}g.${configs[2].memory}gb`,
                gpuIndex: 3,
              },
              {
                type: "node",
                name: `${configs[2].compute}g.${configs[2].memory}gb`,
                gpuIndex: 4,
              },
            ],
          },
        ],
      },
    ],
  };

  // 두 번째 행: 중간 크기 인스턴스들 (2g)
  const secondRow: GpuInstanceRow = {
    height: 28,
    nodes: [
      {
        type: "node",
        name: `${configs[3].compute}g.${configs[3].memory}gb`,
        gpuIndex: 5,
      },
      {
        type: "node",
        name: `${configs[3].compute}g.${configs[3].memory}gb`,
        gpuIndex: 6,
      },
      {
        type: "node",
        name: `${configs[3].compute}g.${configs[3].memory}gb`,
        gpuIndex: 7,
      },
    ],
  };

  // 세 번째 행: 작은 인스턴스들 (1g)
  const thirdRow: GpuInstanceRow = {
    height: 28,
    nodes: [
      {
        type: "node",
        name: `${configs[4].compute}g.${configs[4].memory}gb`,
        gpuIndex: 8,
      },
      {
        type: "node",
        name: `${configs[4].compute}g.${configs[4].memory}gb`,
        gpuIndex: 9,
      },
      {
        type: "node",
        name: `${configs[4].compute}g.${configs[4].memory}gb`,
        gpuIndex: 10,
      },
      {
        type: "node",
        name: `${configs[4].compute}g.${configs[4].memory}gb`,
        gpuIndex: 11,
      },
    ],
  };

  // 네 번째 행: 작은 인스턴스들 (1g) - 마지막 노드는 빈 노드
  const fourthRow: GpuInstanceRow = {
    height: 28,
    nodes: [
      {
        type: "node",
        name: `${configs[4].compute}g.${configs[4].memory}gb`,
        gpuIndex: 12,
      },
      {
        type: "node",
        name: `${configs[4].compute}g.${configs[4].memory}gb`,
        gpuIndex: 13,
      },
      {
        type: "node",
        name: `${configs[4].compute}g.${configs[4].memory}gb`,
        gpuIndex: 14,
      },
      {
        type: "node",
      },
    ],
  };

  return [firstRow, secondRow, thirdRow, fourthRow];
}

interface GenerateDisplayConfigBetaProps {
  /** GPU 모델 설정 */
  config: GpuModelConfig;
}

/**
 * GPU 설정을 기반으로 MIG 인스턴스 표시를 생성하는 공통 컴포넌트
 */
export function GenerateDisplayConfigBeta({
  config,
}: GenerateDisplayConfigBetaProps) {
  const rows = generateRowsFromConfig(config);

  return <GenerateGpuInstance rows={rows} />;
}
