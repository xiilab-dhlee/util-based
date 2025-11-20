"use client";

import type {
  GpuInstanceRow,
  GpuModelConfig,
} from "@/domain/node/types/node.type";
import { GenerateGpuInstance } from "./generate-gpu-instance";

/**
 * A30 GPU 설정을 기반으로 GpuInstanceRow 배열을 생성합니다.
 * A30 GPU의 고정된 MIG 설정 구조를 동적으로 생성합니다.
 */
function generateRowsFromConfig(config: GpuModelConfig): GpuInstanceRow[] {
  const { configs } = config;

  // 첫 번째 행: 4g.24gb 인스턴스와 2g.12gb 인스턴스들
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
            type: "node",
            name: `${configs[1].compute}g.${configs[1].memory}gb`,
            gpuIndex: 3,
          },
        ],
      },
    ],
  };

  // 두 번째 행: 1g.6gb 인스턴스들
  const secondRow: GpuInstanceRow = {
    height: 28,
    nodes: [
      {
        type: "node",
        name: `${configs[2].compute}g.${configs[2].memory}gb`,
        gpuIndex: 4,
      },
      {
        type: "node",
        name: `${configs[2].compute}g.${configs[2].memory}gb`,
        gpuIndex: 5,
      },
      {
        type: "node",
        name: `${configs[2].compute}g.${configs[2].memory}gb`,
        gpuIndex: 6,
      },
      {
        type: "node",
        name: `${configs[2].compute}g.${configs[2].memory}gb`,
        gpuIndex: 7,
      },
    ],
  };

  return [firstRow, secondRow];
}

interface GenerateDisplayConfigAlphaProps {
  /** GPU 모델 설정 */
  config: GpuModelConfig;
}

/**
 * A30 GPU 설정을 기반으로 MIG 인스턴스 표시를 생성하는 컴포넌트
 *
 * A30 GPU의 고정된 MIG 설정 구조를 동적으로 렌더링합니다.
 * 4g.24gb, 2g.12gb, 1g.6gb 인스턴스의 배치를 시각적으로 표시합니다.
 *
 * @param config - A30 GPU 모델 설정 정보
 * @returns MIG 인스턴스 표시 컴포넌트
 */
export function GenerateDisplayConfigAlpha({
  config,
}: GenerateDisplayConfigAlphaProps) {
  const rows = generateRowsFromConfig(config);

  return <GenerateGpuInstance rows={rows} />;
}
