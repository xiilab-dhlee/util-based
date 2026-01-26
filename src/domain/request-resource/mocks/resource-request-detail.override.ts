import { delay, HttpResponse, http } from "msw";

import { getGetResourceRequestDetailResponseMock } from "@/api/generated/admin-workspace/admin-workspace.msw";

// 테스트 시나리오 정의
const resourceRequestScenarios = [
  // Scenario 1: GPU만 요청 (MIG 없음)
  {
    workspaceName: "AI Research Lab",
    resource: {
      gpu: {
        detail: {
          normal: {
            quotaCount: 10,
            requestCount: 15,
            clusterCapacityCount: 100,
          },
        },
      },
      cpu: {
        quotaCore: 128,
        requestCore: 256,
        clusterCapacityCore: 1024,
      },
      memory: {
        quotaByte: 549755813888, // 512GB
        requestByte: 1099511627776, // 1TB
        clusterCapacityByte: 5497558138880, // 5TB
      },
    },
  },
  // Scenario 2: GPU + MIG 1개 프로파일
  {
    workspaceName: "Deep Learning Team",
    resource: {
      gpu: {
        detail: {
          normal: {
            quotaCount: 8,
            requestCount: 12,
            clusterCapacityCount: 100,
          },
          mig: [
            {
              profile: "1g.12gb",
              quotaCount: 5,
              requestCount: 10,
              clusterCapacityCount: 50,
            },
          ],
        },
      },
      cpu: {
        quotaCore: 64,
        requestCore: 128,
        clusterCapacityCore: 1024,
      },
      memory: {
        quotaByte: 274877906944, // 256GB
        requestByte: 549755813888, // 512GB
        clusterCapacityByte: 5497558138880, // 5TB
      },
    },
  },
  // Scenario 3: GPU + MIG 다중 프로파일
  {
    workspaceName: "Computer Vision Lab",
    resource: {
      gpu: {
        detail: {
          normal: {
            quotaCount: 20,
            requestCount: 25,
            clusterCapacityCount: 100,
          },
          mig: [
            {
              profile: "1g.5gb",
              quotaCount: 3,
              requestCount: 8,
              clusterCapacityCount: 30,
            },
            {
              profile: "2g.10gb",
              quotaCount: 4,
              requestCount: 12,
              clusterCapacityCount: 40,
            },
            {
              profile: "3g.20gb",
              quotaCount: 6,
              requestCount: 10,
              clusterCapacityCount: 50,
            },
          ],
        },
      },
      cpu: {
        quotaCore: 256,
        requestCore: 512,
        clusterCapacityCore: 2048,
      },
      memory: {
        quotaByte: 1099511627776, // 1TB
        requestByte: 2199023255552, // 2TB
        clusterCapacityByte: 10995116277760, // 10TB
      },
    },
  },
  // Scenario 4: GPU + MIG 전체 프로파일 (5개)
  {
    workspaceName: "ML Platform Team",
    resource: {
      gpu: {
        detail: {
          normal: {
            quotaCount: 50,
            requestCount: 64,
            clusterCapacityCount: 200,
          },
          mig: [
            {
              profile: "1g.5gb",
              quotaCount: 5,
              requestCount: 15,
              clusterCapacityCount: 80,
            },
            {
              profile: "2g.10gb",
              quotaCount: 10,
              requestCount: 20,
              clusterCapacityCount: 100,
            },
            {
              profile: "3g.20gb",
              quotaCount: 8,
              requestCount: 18,
              clusterCapacityCount: 60,
            },
            {
              profile: "4g.20gb",
              quotaCount: 4,
              requestCount: 10,
              clusterCapacityCount: 40,
            },
            {
              profile: "7g.40gb",
              quotaCount: 2,
              requestCount: 8,
              clusterCapacityCount: 20,
            },
          ],
        },
      },
      cpu: {
        quotaCore: 512,
        requestCore: 1024,
        clusterCapacityCore: 4096,
      },
      memory: {
        quotaByte: 2199023255552, // 2TB
        requestByte: 4398046511104, // 4TB
        clusterCapacityByte: 21990232555520, // 20TB
      },
    },
  },
  // Scenario 5: CPU, Memory만 요청 (GPU 요청 없음)
  {
    workspaceName: "Backend Services",
    resource: {
      gpu: {
        detail: {
          normal: {
            quotaCount: 5,
            requestCount: 0, // GPU 요청 없음
            clusterCapacityCount: 100,
          },
        },
      },
      cpu: {
        quotaCore: 32,
        requestCore: 128,
        clusterCapacityCore: 20,
      },
      memory: {
        quotaByte: 137438953472, // 128GB
        requestByte: 549755813888, // 512GB
        clusterCapacityByte: 5497558138880, // 5TB
      },
    },
  },
  // Scenario 6: 용량 초과 테스트 (에러 상태)
  {
    workspaceName: "Capacity Overflow Test",
    resource: {
      gpu: {
        detail: {
          normal: {
            quotaCount: 50,
            requestCount: 150, // 초과! (max = 100)
            clusterCapacityCount: 100,
          },
          mig: [
            {
              profile: "2g.10gb",
              quotaCount: 10,
              requestCount: 60, // 초과! (max = 40)
              clusterCapacityCount: 40,
            },
          ],
        },
      },
      cpu: {
        quotaCore: 64,
        requestCore: 256, // 초과! (max = 128)
        clusterCapacityCore: 128,
      },
      memory: {
        quotaByte: 137438953472, // 128GB
        requestByte: 1099511627776, // 1TB (초과! max = 512GB)
        clusterCapacityByte: 549755813888, // 512GB
      },
    },
  },
];

export const resourceRequestDetailOverrideHandlers = [
  http.get(
    "*/api/v1/admin/workspaces/resources/requests/:resourceRequestId",
    async () => {
      await delay(800);

      const base = getGetResourceRequestDetailResponseMock();
      if (!base.data) {
        return HttpResponse.json(base, { status: 200 });
      }

      // 랜덤으로 시나리오 선택
      const randomScenario =
        resourceRequestScenarios[
          Math.floor(Math.random() * resourceRequestScenarios.length)
        ];

      return HttpResponse.json(
        {
          ...base,
          data: {
            ...base.data,
            ...randomScenario,
          },
        },
        { status: 200 },
      );
    },
  ),
];
