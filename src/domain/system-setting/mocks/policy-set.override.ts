import { delay, HttpResponse, http } from "msw";

import { getGetPolicySetResponseMock } from "@/api/generated/admin-workspace/admin-workspace.msw";

// 테스트 시나리오 정의
const policySetScenarios = [
  // Scenario 1: Minimal (MIG 없음, MPS 없음)
  {
    workspaceLimitCount: 12,
    resource: {
      gpu: {
        detail: {
          normal: {
            requestCount: 15,
          },
        },
      },
      cpu: {
        requestCore: 4,
      },
      memory: {
        requestByte: 12884901888, // 12GB
      },
    },
  },
  // Scenario 2: MPS만 있음 (MIG 없음)
  {
    workspaceLimitCount: 20,
    resource: {
      gpu: {
        detail: {
          normal: {
            requestCount: 128,
          },
          mps: {
            requestCount: 64,
          },
        },
      },
      cpu: {
        requestCore: 512,
      },
      memory: {
        requestByte: 1099511627776, // 1TB
      },
    },
  },
  // Scenario 3: MIG만 있음 (MPS 없음)
  {
    workspaceLimitCount: 30,
    resource: {
      gpu: {
        detail: {
          normal: {
            requestCount: 128,
          },
          mig: [
            { profile: "1g.5gb", requestCount: 3 },
            { profile: "2g.10gb", requestCount: 4 },
            { profile: "3g.20gb", requestCount: 6 },
          ],
        },
      },
      cpu: {
        requestCore: 256,
      },
      memory: {
        requestByte: 549755813888, // 512GB
      },
    },
  },
  // Scenario 4: Full (MIG, MPS 둘 다 있음)
  {
    workspaceLimitCount: 50,
    resource: {
      gpu: {
        detail: {
          normal: {
            requestCount: 128,
          },
          mps: {
            requestCount: 64,
          },
          mig: [
            { profile: "1g.5gb", requestCount: 5 },
            { profile: "2g.10gb", requestCount: 24 },
            { profile: "3g.20gb", requestCount: 16 },
            { profile: "4g.20gb", requestCount: 2 },
            { profile: "7g.40gb", requestCount: 8 },
          ],
        },
      },
      cpu: {
        requestCore: 512,
      },
      memory: {
        requestByte: 1099511627776, // 1TB
      },
    },
  },
  // Scenario 5: Large numbers (큰 숫자 포맷팅 테스트)
  {
    workspaceLimitCount: 1000,
    resource: {
      gpu: {
        detail: {
          normal: {
            requestCount: 9999,
          },
          mps: {
            requestCount: 8888,
          },
          mig: [
            { profile: "1g.5gb", requestCount: 1234 },
            { profile: "7g.40gb", requestCount: 5678 },
          ],
        },
      },
      cpu: {
        requestCore: 10000,
      },
      memory: {
        requestByte: 10995116277760, // 10TB
      },
    },
  },
];

export const policySetOverrideHandlers = [
  http.get("*/api/v1/admin/workspaces/policy-sets", async () => {
    await delay(1000);

    const base = getGetPolicySetResponseMock();
    if (!base.data) {
      return HttpResponse.json(base, { status: 200 });
    }

    // 랜덤으로 시나리오 선택
    const randomScenario =
      policySetScenarios[Math.floor(Math.random() * policySetScenarios.length)];

    return HttpResponse.json(
      {
        ...base,
        data: randomScenario,
      },
      { status: 200 },
    );
  }),
];
