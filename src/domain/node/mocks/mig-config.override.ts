import { faker } from "@faker-js/faker";

import {
  getGetMigConfigurationMockHandler,
  getGetMigConfigurationResponseMock,
} from "@/api/generated/admin-cluster/admin-cluster.msw";

/**
 * MigUtil.findSupportedModel에서 지원하는 GPU 모델 목록
 * MIG_GPU_ALPHA_MODEL: A30
 * MIG_GPU_BETA_MODEL: A100, A100-80GB, H100, H100-94GB, H100-96GB, H200, B200
 */
const SUPPORTED_GPU_PRODUCTS = [
  "NVIDIA A30-24GB",
  "NVIDIA A100-SXM4-40GB",
  "NVIDIA A100-SXM4-80GB",
  "NVIDIA A100-PCIE-40GB",
  "NVIDIA A100-80GB-PCIE",
  "NVIDIA H100-SXM5-80GB",
  "NVIDIA H100-PCIE-80GB",
  "NVIDIA H100-94GB-HBM3",
  "NVIDIA H100-96GB-HBM3e",
  "NVIDIA H200-SXM-141GB",
  "NVIDIA B200-SXM-180GB",
] as const;

/**
 * MIG 설정 조회 API override handler
 * - gpuProduct가 MigUtil.findSupportedModel에서 허용되는 값으로 반환
 */
export const migConfigOverrideHandlers = [
  getGetMigConfigurationMockHandler(async (info) => {
    const { nodeName } = info.params as { nodeName: string };

    // 지원되는 GPU 모델 중 하나를 랜덤으로 선택
    const gpuProduct = faker.helpers.arrayElement(SUPPORTED_GPU_PRODUCTS);

    // GPU 개수 (1~8개)
    const gpuCount = faker.number.int({ min: 1, max: 8 });

    // MIG 정보 생성
    const migInfo = Array.from({ length: gpuCount }, (_, gpuIndex) => ({
      gpuIndex: [gpuIndex],
      // 기본적으로 MIG 비활성화 상태 (configId: 0)
      // 일부는 활성화된 상태로 설정
      configId: faker.datatype.boolean()
        ? 0
        : faker.number.int({ min: 1, max: 20 }),
    }));

    return getGetMigConfigurationResponseMock({
      data: {
        nodeName,
        gpuProduct,
        migInfo,
      },
    });
  }),
];
