import { delay, HttpResponse, http } from "msw";

import { getGetDefaultResourceResponseMock } from "@/api/generated/workspace/workspace.msw";

// 테스트 시나리오 정의
const resourceScenarios = [
  // Scenario 1: Minimal (MIG 없음, MPS 없음)
  {
    gpu: {
      detail: {
        normal: {
          requestCount: 128,
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
  // Scenario 2: MPS만 있음 (MIG 없음)
  {
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
  // Scenario 3: MIG만 있음 (MPS 없음)
  {
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
      requestCore: 512,
    },
    memory: {
      requestByte: 1099511627776, // 1TB
    },
  },
  // Scenario 4: Full (MIG, MPS 둘 다 있음)
  {
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
];

export const defaultResourceOverrideHandlers = [
  http.get("*/api/v1/workspaces/default-resource", async () => {
    await delay(1000);

    const base = getGetDefaultResourceResponseMock();
    if (!base.data) {
      return HttpResponse.json(base, { status: 200 });
    }

    // 랜덤으로 시나리오 선택
    const randomScenario =
      resourceScenarios[Math.floor(Math.random() * resourceScenarios.length)];

    return HttpResponse.json(
      {
        ...base,
        data: {
          ...base.data,
          resource: randomScenario,
        },
      },
      { status: 200 },
    );
  }),
];
