import { expect } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import { testId, WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";
import { WorkloadDetailPage } from "../../pages/workload-detail.page";

/**
 * 워크로드 상세 페이지 Step Definitions
 *
 * Page Objects:
 * - workloadDetailPage: 워크로드 상세 페이지 (eventCards, sourcecodeCards, tabs, 상세 정보 등)
 */
const { Then, Given } = createBdd(test);

// ============================================
// 페이지 표시 확인 Steps
// ============================================

Then("워크로드 상세 페이지가 표시된다", async ({ workloadDetailPage }) => {
  await workloadDetailPage.assertPageVisible();
});

// ============================================
// 좌측 요약 패널 Steps (기본 정보)
// ============================================

Then("워크로드 이름이 표시된다", async ({ workloadDetailPage, assertLogger }) => {
  await assertLogger.assertLocatorText("워크로드 이름", workloadDetailPage.name);
});

Then(
  "워크로드 상태가 다음 중 하나로 표시된다:",
  async ({ workloadDetailPage, assertLogger }, dataTable: DataTable) => {
    const validStatuses = dataTable.rows().map((row) => row[0]);
    const status = await workloadDetailPage.getStatusValue();
    assertLogger.assertContains("워크로드 상태", status, validStatuses);
  },
);

Then("워크로드 설명이 표시된다", async ({ workloadDetailPage }) => {
  await expect(workloadDetailPage.description).toBeVisible();
});

Then(
  "워크로드 {word} 버튼이 표시된다",
  async ({ workloadDetailPage }, buttonName: string) => {
    const selector = WorkloadDetailPage.BUTTON[buttonName];
    if (!selector) {
      throw new Error(
        `알 수 없는 버튼: ${buttonName}. 가능한 값: ${Object.keys(WorkloadDetailPage.BUTTON).join(", ")}`,
      );
    }
    await expect(workloadDetailPage.getButton(selector)).toBeVisible();
  },
);

// ============================================
// 이벤트 이력 Steps
// ============================================

Then(
  "각 이벤트 이름이 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
    await workloadDetailPage.eventCards.forEachCard(
      "h6",
      async (element, i) => {
        await assertLogger.assertLocatorText(`이벤트[${i}] 이름`, element);
      },
    );
  },
);

Then(
  "각 이벤트 상태가 다음 중 하나이다:",
  async ({ workloadDetailPage, assertLogger }, dataTable: DataTable) => {
    const validStatuses = dataTable
      .raw()
      .slice(1)
      .flat()
      .map((s) => s.toLowerCase());

    await workloadDetailPage.eventCards.forEachByPrefix(
      "workload-event-status-",
      (status, i) => {
        assertLogger.assertContains(
          `이벤트[${i}] 상태`,
          status.toLowerCase(),
          validStatuses,
        );
      },
    );
  },
);

Then(
  "각 이벤트 경과 시간이 yyyy.MM.dd HH:mm:ss 형식으로 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
    const dateTimeRegex = /^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}:\d{2}$/;

    await workloadDetailPage.eventCards.forEachCardText(
      testId(WORKLOAD_SELECTOR.EVENT_ELAPSED_TIME),
      (text, i) => {
        assertLogger.assertMatch(`이벤트[${i}] 경과 시간`, text, dateTimeRegex);
      },
    );
  },
);

Then(
  "각 이벤트 From이 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
    await workloadDetailPage.eventCards.forEachCard(
      testId(WORKLOAD_SELECTOR.EVENT_FROM),
      async (element, i) => {
        await assertLogger.assertLocatorText(`이벤트[${i}] From`, element);
      },
    );
  },
);

Then(
  "각 이벤트 메시지가 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
    await workloadDetailPage.eventCards.forEachCard(
      testId(WORKLOAD_SELECTOR.EVENT_MESSAGE),
      async (element, i) => {
        await assertLogger.assertLocatorText(`이벤트[${i}] 메시지`, element);
      },
    );
  },
);

// ============================================
// 소스코드 Steps
// ============================================

Then(
  "각 소스코드 이름이 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
    await workloadDetailPage.sourcecodeCards.forEachCard(
      "h6",
      async (element, i) => {
        await assertLogger.assertLocatorText(`소스코드[${i}] 이름`, element);
      },
    );
  },
);

Then(
  "각 소스코드 상태가 다음 중 하나이다:",
  async ({ workloadDetailPage, assertLogger }, dataTable: DataTable) => {
    const validStatuses = dataTable
      .raw()
      .slice(1)
      .flat()
      .map((s) => s.toLowerCase());

    await workloadDetailPage.sourcecodeCards.forEachByPrefixAttached(
      "workload-source-code-status-",
      (status, i) => {
        assertLogger.assertContains(
          `소스코드[${i}] 상태`,
          status.toLowerCase(),
          validStatuses,
        );
      },
    );
  },
);

Then("각 소스코드 경로가 표시된다", async ({ workloadDetailPage }) => {
  await workloadDetailPage.sourcecodeCards.forEachCard(
    testId(WORKLOAD_SELECTOR.SOURCECODE_PATH),
    async (element) => {
      await expect(element).toBeVisible();
    },
  );
});

Then(
  "각 소스코드 Git URL이 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
    await workloadDetailPage.sourcecodeCards.forEachCard(
      testId(WORKLOAD_SELECTOR.SOURCECODE_URL),
      async (element, i) => {
        await assertLogger.assertLocatorText(`소스코드[${i}] Git URL`, element);
      },
    );
  },
);

Then(
  "각 소스코드 타입이 다음 중 하나이다:",
  async ({ workloadDetailPage, assertLogger }, dataTable: DataTable) => {
    const validTypes = dataTable
      .raw()
      .slice(1)
      .flat()
      .map((t) => t.toLowerCase());

    await workloadDetailPage.sourcecodeCards.forEachByPrefix(
      "workload-source-code-type-",
      (type, i) => {
        assertLogger.assertContains(
          `소스코드[${i}] 타입`,
          type.toLowerCase(),
          validTypes,
        );
      },
    );
  },
);

// ============================================
// 상세정보 탭 내용 Steps
// ============================================

Then("Job Type 정보가 표시된다", async ({ workloadDetailPage, assertLogger }) => {
  await assertLogger.assertLocatorText(
    "Job Type 이름",
    workloadDetailPage.jobTypeName,
  );
  await assertLogger.assertLocatorText(
    "Job Type IDE",
    workloadDetailPage.jobTypeIde,
  );
});

Then("노드 타입 정보가 표시된다", async ({ workloadDetailPage, assertLogger }) => {
  await assertLogger.assertLocatorText(
    "노드 타입",
    workloadDetailPage.nodeTypeName,
  );
});

Then("이미지 정보가 표시된다", async ({ workloadDetailPage, assertLogger }) => {
  await assertLogger.assertLocatorText(
    "이미지 타입",
    workloadDetailPage.imageType,
  );
  await assertLogger.assertLocatorText(
    "이미지 이름",
    workloadDetailPage.imageName,
  );
});

Then("Commit Image 생성 버튼이 표시된다", async ({ workloadDetailPage }) => {
  await expect(workloadDetailPage.commitImageButton).toBeVisible();
});

Then("보안검사 결과가 표시된다", async ({ workloadDetailPage, assertLogger }) => {
  const securityLevels = workloadDetailPage.getSecurityLevels();

  for (const { locator, name } of securityLevels) {
    await assertLogger.assertLocatorText(`보안검사 ${name}`, locator);
  }
});

Then(
  "실행 경로, 실행 명령어 정보가 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
    await assertLogger.assertLocatorText(
      "실행 경로",
      workloadDetailPage.execPath,
    );
    await assertLogger.assertLocatorText(
      "실행 명령어",
      workloadDetailPage.execCommand,
    );
  },
);

Then("환경변수 정보가 표시된다", async ({ workloadDetailPage, assertLogger }) => {
  await workloadDetailPage.forEachLocator(
    workloadDetailPage.envKeys,
    async (element, i) => {
      await assertLogger.assertLocatorText(`환경변수[${i}] 키`, element);
    },
  );

  await workloadDetailPage.forEachLocator(
    workloadDetailPage.envValues,
    async (element, i) => {
      await assertLogger.assertLocatorText(`환경변수[${i}] 값`, element);
    },
  );
});

Then("포트 정보가 표시된다", async ({ workloadDetailPage, assertLogger }) => {
  await workloadDetailPage.forEachLocator(
    workloadDetailPage.portNames,
    async (element, i) => {
      await assertLogger.assertLocatorText(`포트[${i}] 이름`, element);
    },
  );

  await workloadDetailPage.forEachLocator(
    workloadDetailPage.portValues,
    async (element, i) => {
      await assertLogger.assertLocatorText(`포트[${i}] 값`, element);
    },
  );

  await workloadDetailPage.forEachLocator(
    workloadDetailPage.portUrls,
    async (element, i) => {
      await assertLogger.assertLocatorText(`포트[${i}] URL`, element);
    },
  );
});

Then("생성자가 표시된다", async ({ workloadDetailPage, assertLogger }) => {
  await assertLogger.assertLocatorText("생성자", workloadDetailPage.creator);
});

Then(
  "생성일이 yyyy.MM.dd 형식으로 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
    await expect(workloadDetailPage.createdDate).toBeVisible();
    const text = (await workloadDetailPage.createdDate.textContent()) ?? "";
    assertLogger.assertMatch("생성일", text, /\d{4}\.\d{2}\.\d{2}/);
  },
);

Then("선택한 GPU 정보가 표시된다", async ({ workloadDetailPage, assertLogger }) => {
  await assertLogger.assertLocatorText("GPU 타입", workloadDetailPage.gpuType);
  await assertLogger.assertLocatorText("GPU 이름", workloadDetailPage.gpuName);
  await assertLogger.assertLocatorText("GPU 메모리", workloadDetailPage.gpuMemory);
});

Then("리소스 정보가 표시된다", async ({ workloadDetailPage, assertLogger }) => {
  await assertLogger.assertLocatorText("GPU 개수", workloadDetailPage.gpuCount);
  await assertLogger.assertLocatorText("CPU 코어", workloadDetailPage.cpuCore);
  await assertLogger.assertLocatorText("메모리", workloadDetailPage.memoryGb);
});

// ============================================
// 상태별 검증 Steps
// ============================================

Given(
  "워크로드 상태가 {string}이다",
  async ({ workloadDetailPage, $testInfo }, status: string) => {
    const currentStatus = await workloadDetailPage.getStatusValue();
    const expectedStatus = WorkloadDetailPage.STATUS_MAP[status] ?? status;

    if (currentStatus !== expectedStatus) {
      $testInfo.skip(
        true,
        `현재 워크로드 상태가 "${status}"이(가) 아니어서 시나리오를 스킵합니다 (현재: ${currentStatus})`,
      );
    }
  },
);

// 상태별 탭 활성화 규칙
const TAB_STATE_BY_STATUS: Record<string, { disabled: string[] }> = {
  대기중: {
    disabled: ["로그", "웹터미널", "모니터링", "파일 목록"],
  },
  실행중: {
    disabled: [],
  },
  종료: {
    disabled: ["파일 목록"],
  },
};

Then(
  "{string} 상태의 탭 활성화 상태가 올바르다",
  async ({ workloadDetailPage, $testInfo }, status: string) => {
    const tabRule = TAB_STATE_BY_STATUS[status];
    if (!tabRule) {
      return $testInfo.skip(true, `규칙이 없는 상태: ${status}`);
    }

    // 비활성화된 탭 검증
    for (const tabName of tabRule.disabled) {
      await workloadDetailPage.tabs.assertTabDisabled(tabName);
    }
  },
);
