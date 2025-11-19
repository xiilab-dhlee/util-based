import type { DropdownOption } from "xiilab-ui";

import {
  MIG_GPU_ALPHA_CONFIG,
  MIG_GPU_ALPHA_MODEL,
  MIG_GPU_BETA_CONFIG,
  MIG_GPU_BETA_MODEL,
} from "@/constants/node/mig.constant";
import type { GpuModelConfig } from "@/types/node/node.type";

/**
 * MIG 설정 관련 유틸리티 클래스
 */
export class MigUtil {
  private configMappings: Record<
    number,
    Array<{ gpuIndex: number; compute: number }>
  >;

  constructor(private readonly gpuProduct: string) {
    if (this.gpuProduct === "A30") {
      this.configMappings = MIG_GPU_ALPHA_CONFIG;
    } else {
      this.configMappings = MIG_GPU_BETA_CONFIG;
    }
  }

  // 기본 instances 생성
  public generateSelectInstances() {
    let maxGpuIndex = 0;
    Object.values(this.configMappings).forEach((mappings) => {
      mappings.forEach((mapping) => {
        maxGpuIndex = Math.max(maxGpuIndex, mapping.gpuIndex);
      });
    });

    const instances = Array.from({ length: maxGpuIndex + 1 }).fill(
      false,
    ) as boolean[];

    return instances;
  }

  // configId에 맞는 instances 제공
  public getConfigInstances(configId: number) {
    const instances = this.generateSelectInstances();

    if (configId > 0) {
      this.configMappings[configId]?.forEach((mapping) => {
        instances[mapping.gpuIndex] = true;
      });
    }

    return instances;
  }

  // configId로 instances 개수를 구하는 메서드
  public getInstanceCount(configId: number) {
    if (configId <= 0) {
      return 0;
    }

    const mappings = this.configMappings[configId];

    return mappings ? mappings.length : 0;
  }

  // configId로 profile 생성
  public createProfile(configId: number) {
    if (configId <= 0) {
      return {};
    }

    const mappings = this.configMappings[configId];
    if (!mappings) {
      return {};
    }

    // GPU 제품별 메모리 설정 가져오기
    const memoryConfig = this.getMemoryConfig();
    if (!memoryConfig) {
      return {};
    }

    // profile 생성 (name → 사용 횟수)
    const profile: Record<string, number> = {};

    mappings.forEach((mapping) => {
      const memory = memoryConfig[mapping.compute];
      if (memory) {
        const name = `${mapping.compute}g.${memory}gb`;
        profile[name] = (profile[name] || 0) + 1;
      }
    });

    return profile;
  }

  // instances countOptions 조회
  public getCountOptions() {
    // configMappings의 모든 키를 순회하여 배열 길이의 경우의 수를 수집
    const counts = new Set<number>();

    Object.values(this.configMappings).forEach((mappings) => {
      counts.add(mappings.length);
    });

    // 비활성화 옵션 추가
    const options: DropdownOption[] = [
      {
        label: "비활성화",
        value: "DISABLED",
      },
    ];

    // 정렬된 count 값들을 옵션으로 추가
    Array.from(counts)
      .sort((a, b) => a - b)
      .forEach((count) => {
        options.push({
          label: `${count}개`,
          value: count.toString(),
        });
      });

    return options;
  }

  // instances count에 맞는 configOptions 조회
  public getConfigOptions(count: string) {
    const targetCount = parseInt(count, 10);

    // configMappings에서 해당 count와 일치하는 configId들 필터링
    const matchingConfigs = Object.entries(this.configMappings)
      .filter(([, mappings]) => mappings.length === targetCount)
      .map(([configId, mappings]) => ({
        configId: parseInt(configId, 10),
        mappings,
      }));

    // 메모리 설정 가져오기
    const memoryConfig = this.getMemoryConfig();
    if (!memoryConfig) {
      return [];
    }

    // 각 config에 대해 라벨 생성
    return matchingConfigs.map(({ configId, mappings }) => {
      // compute별 개수 계산
      const computeCounts = mappings.reduce(
        (acc, mapping) => {
          acc[mapping.compute] = (acc[mapping.compute] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>,
      );

      // 라벨 생성 (예: "4G.24GB X 1개 2G.12GB X 2개")
      const labelParts = Object.entries(computeCounts)
        .sort(([a], [b]) => parseInt(b, 10) - parseInt(a, 10)) // compute 내림차순 정렬
        .map(([compute, count]) => {
          const memory = memoryConfig[parseInt(compute, 10)];
          return `${compute}G.${memory}GB X ${count}개`;
        });

      const label = labelParts.join(" ");

      return {
        label,
        value: configId.toString(),
      };
    });
  }

  // 메모리 설저 조회
  private getMemoryConfig() {
    let gpuConfig: GpuModelConfig;
    if (this.gpuProduct === "A30") {
      gpuConfig = MIG_GPU_ALPHA_MODEL[this.gpuProduct];
    } else {
      gpuConfig = MIG_GPU_BETA_MODEL[this.gpuProduct];
    }

    return gpuConfig.configs.reduce(
      (acc, config) => {
        acc[config.compute] = config.memory;
        return acc;
      },
      {} as Record<number, number>,
    );
  }
}
