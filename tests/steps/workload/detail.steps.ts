import { expect } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import {
  testId,
  testIdPrefix,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/**
 * 워크로드 상세 페이지 Step Definitions
 */
const { When, Then, Given } = createBdd(test);

// ============================================
// 상세 페이지 진입 Steps
// ============================================

When(
  "사용자가 워크로드 상세 페이지로 진입한다",
  async ({ page, workloadId, workspaceId }) => {
    // 모킹은 인증 Hook에서 설정됨
    await page.goto(`/user/workload/${workloadId}?workspaceId=${workspaceId}`);
    await page.waitForLoadState("networkidle");
  },
);

Then("워크로드 상세 페이지가 표시된다", async ({ page }) => {
  const pageHeader = page.locator(testId(WORKLOAD_SELECTOR.PAGE_HEADER_DETAIL));
  await expect(pageHeader).toBeVisible();
});

// ============================================
// 좌측 요약 패널 Steps (기본 정보)
// ============================================

Then("워크로드 이름이 표시된다", async ({ page, assertLogger }) => {
  const name = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_NAME));
  await assertLogger.assertLocatorText("워크로드 이름", name);
});

Then(
  "워크로드 상태가 다음 중 하나로 표시된다:",
  async ({ page, assertLogger }, dataTable: DataTable) => {
    const validStatuses = dataTable.rows().map((row) => row[0]);

    const statusElement = page.locator(testIdPrefix("workload-status-"));
    await expect(statusElement).toBeVisible();

    const testIdValue = await statusElement.getAttribute("data-testid");
    const status = testIdValue?.replace("workload-status-", "") ?? "";
    assertLogger.assertContains("워크로드 상태", status, validStatuses);
  },
);

Then("워크로드 설명이 표시된다", async ({ page }) => {
  const description = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_DESCRIPTION),
  );
  await expect(description).toBeVisible();
});

const DETAIL_BUTTON_MAP: Record<string, string> = {
  수정: WORKLOAD_SELECTOR.DETAIL_EDIT_BUTTON,
  종료: WORKLOAD_SELECTOR.DETAIL_STOP_BUTTON,
  재시작: WORKLOAD_SELECTOR.DETAIL_RESTART_BUTTON,
  삭제: WORKLOAD_SELECTOR.DETAIL_DELETE_BUTTON,
};

Then(
  "워크로드 {word} 버튼이 표시된다",
  async ({ page }, buttonName: string) => {
    const selector = DETAIL_BUTTON_MAP[buttonName];
    if (!selector) {
      throw new Error(
        `알 수 없는 버튼: ${buttonName}. 가능한 값: ${Object.keys(DETAIL_BUTTON_MAP).join(", ")}`,
      );
    }
    await expect(page.locator(testId(selector))).toBeVisible();
  },
);

// ============================================
// 이벤트 이력 Steps
// ============================================

Then("각 이벤트 이름이 표시된다", async ({ page, assertLogger }) => {
  const eventCards = page.locator(testId(WORKLOAD_SELECTOR.EVENT_CARD));
  const count = await eventCards.count();

  for (let i = 0; i < count; i++) {
    const h6Element = eventCards.nth(i).locator("h6");
    await assertLogger.assertLocatorText(`이벤트[${i}] 이름`, h6Element);
  }
});

Then(
  "각 이벤트 상태가 다음 중 하나이다:",
  async ({ page, assertLogger }, dataTable: DataTable) => {
    const validStatuses = dataTable
      .raw()
      .slice(1)
      .flat()
      .map((s) => s.toLowerCase());

    const statusElements = page.locator(testIdPrefix("workload-event-status-"));
    const count = await statusElements.count();

    for (let i = 0; i < count; i++) {
      const statusElement = statusElements.nth(i);
      await expect(statusElement).toBeVisible();

      const testIdValue = await statusElement.getAttribute("data-testid");
      const status =
        testIdValue?.replace("workload-event-status-", "").toLowerCase() ?? "";
      assertLogger.assertContains(`이벤트[${i}] 상태`, status, validStatuses);
    }
  },
);

Then(
  "각 이벤트 경과 시간이 yyyy.MM.dd HH:mm:ss 형식으로 표시된다",
  async ({ page, assertLogger }) => {
    const dateTimeRegex = /^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}:\d{2}$/;

    const elapsedTimeElements = page.locator(
      testId(WORKLOAD_SELECTOR.EVENT_ELAPSED_TIME),
    );
    const count = await elapsedTimeElements.count();

    for (let i = 0; i < count; i++) {
      const elapsedTimeElement = elapsedTimeElements.nth(i);
      await expect(elapsedTimeElement).toBeVisible();
      const text = (await elapsedTimeElement.textContent())?.trim() ?? "";
      assertLogger.assertMatch(`이벤트[${i}] 경과 시간`, text, dateTimeRegex);
    }
  },
);

Then("각 이벤트 From이 표시된다", async ({ page, assertLogger }) => {
  const fromElements = page.locator(testId(WORKLOAD_SELECTOR.EVENT_FROM));
  const count = await fromElements.count();

  for (let i = 0; i < count; i++) {
    await assertLogger.assertLocatorText(
      `이벤트[${i}] From`,
      fromElements.nth(i),
    );
  }
});

Then("각 이벤트 메시지가 표시된다", async ({ page, assertLogger }) => {
  const messageElements = page.locator(testId(WORKLOAD_SELECTOR.EVENT_MESSAGE));
  const count = await messageElements.count();

  for (let i = 0; i < count; i++) {
    await assertLogger.assertLocatorText(
      `이벤트[${i}] 메시지`,
      messageElements.nth(i),
    );
  }
});

// ============================================
// 소스코드 Steps
// ============================================

Then("각 소스코드 이름이 표시된다", async ({ page, assertLogger }) => {
  const sourcecodeCards = page.locator(
    testId(WORKLOAD_SELECTOR.SOURCECODE_CARD),
  );
  const count = await sourcecodeCards.count();

  for (let i = 0; i < count; i++) {
    const h6Element = sourcecodeCards.nth(i).locator("h6");
    await assertLogger.assertLocatorText(`소스코드[${i}] 이름`, h6Element);
  }
});

Then(
  "각 소스코드 상태가 다음 중 하나이다:",
  async ({ page, assertLogger }, dataTable: DataTable) => {
    const validStatuses = dataTable
      .raw()
      .slice(1)
      .flat()
      .map((s) => s.toLowerCase());

    const statusElements = page.locator(
      testIdPrefix("workload-source-code-status-"),
    );
    const count = await statusElements.count();

    for (let i = 0; i < count; i++) {
      const statusElement = statusElements.nth(i);
      await expect(statusElement).toBeAttached();

      const testIdValue = await statusElement.getAttribute("data-testid");
      const status =
        testIdValue
          ?.replace("workload-source-code-status-", "")
          .toLowerCase() ?? "";
      assertLogger.assertContains(`소스코드[${i}] 상태`, status, validStatuses);
    }
  },
);

Then("각 소스코드 경로가 표시된다", async ({ page }) => {
  const pathElements = page.locator(testId(WORKLOAD_SELECTOR.SOURCECODE_PATH));
  const count = await pathElements.count();

  for (let i = 0; i < count; i++) {
    await expect(pathElements.nth(i)).toBeVisible();
  }
});

Then("각 소스코드 Git URL이 표시된다", async ({ page, assertLogger }) => {
  const urlElements = page.locator(testId(WORKLOAD_SELECTOR.SOURCECODE_URL));
  const count = await urlElements.count();

  for (let i = 0; i < count; i++) {
    await assertLogger.assertLocatorText(
      `소스코드[${i}] Git URL`,
      urlElements.nth(i),
    );
  }
});

Then(
  "각 소스코드 타입이 다음 중 하나이다:",
  async ({ page, assertLogger }, dataTable: DataTable) => {
    const validTypes = dataTable
      .raw()
      .slice(1)
      .flat()
      .map((t) => t.toLowerCase());

    const typeElements = page.locator(
      testIdPrefix("workload-source-code-type-"),
    );
    const count = await typeElements.count();

    for (let i = 0; i < count; i++) {
      const typeElement = typeElements.nth(i);
      await expect(typeElement).toBeVisible();

      const testIdValue = await typeElement.getAttribute("data-testid");
      const type =
        testIdValue?.replace("workload-source-code-type-", "").toLowerCase() ??
        "";
      assertLogger.assertContains(`소스코드[${i}] 타입`, type, validTypes);
    }
  },
);

// ============================================
// 상세정보 탭 내용 Steps
// ============================================

Then("Job Type 정보가 표시된다", async ({ page, assertLogger }) => {
  const jobTypeName = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_JOB_TYPE_NAME),
  );
  await assertLogger.assertLocatorText("Job Type 이름", jobTypeName);

  const jobTypeIde = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_JOB_TYPE_IDE),
  );
  await assertLogger.assertLocatorText("Job Type IDE", jobTypeIde);
});

Then("노드 타입 정보가 표시된다", async ({ page, assertLogger }) => {
  const nodeTypeName = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_NODE_TYPE_NAME),
  );
  await assertLogger.assertLocatorText("노드 타입", nodeTypeName);
});

Then("이미지 정보가 표시된다", async ({ page, assertLogger }) => {
  const imageType = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_IMAGE_TYPE));
  await assertLogger.assertLocatorText("이미지 타입", imageType);

  const imageName = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_IMAGE_NAME));
  await assertLogger.assertLocatorText("이미지 이름", imageName);
});

Then("Commit Image 생성 버튼이 표시된다", async ({ page }) => {
  const commitButton = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_COMMIT_IMAGE_BUTTON),
  );
  await expect(commitButton).toBeVisible();
});

Then("보안검사 결과가 표시된다", async ({ page, assertLogger }) => {
  const securityLevels = [
    {
      selector: WORKLOAD_SELECTOR.DETAIL_SECURITY_LEVEL_CRITICAL,
      name: "Critical",
    },
    { selector: WORKLOAD_SELECTOR.DETAIL_SECURITY_LEVEL_HIGH, name: "High" },
    {
      selector: WORKLOAD_SELECTOR.DETAIL_SECURITY_LEVEL_MEDIUM,
      name: "Medium",
    },
    { selector: WORKLOAD_SELECTOR.DETAIL_SECURITY_LEVEL_LOW, name: "Low" },
  ];

  for (const { selector, name } of securityLevels) {
    const element = page.locator(testId(selector));
    await assertLogger.assertLocatorText(`보안검사 ${name}`, element);
  }
});

Then(
  "실행 경로, 실행 명령어 정보가 표시된다",
  async ({ page, assertLogger }) => {
    const execPath = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_EXEC_PATH));
    await assertLogger.assertLocatorText("실행 경로", execPath);

    const execCommand = page.locator(
      testId(WORKLOAD_SELECTOR.DETAIL_EXEC_COMMAND),
    );
    await assertLogger.assertLocatorText("실행 명령어", execCommand);
  },
);

Then("환경변수 정보가 표시된다", async ({ page, assertLogger }) => {
  const envKeys = page.locator(testId(WORKLOAD_SELECTOR.ENV_KEY));
  const keyCount = await envKeys.count();

  for (let i = 0; i < keyCount; i++) {
    await assertLogger.assertLocatorText(`환경변수[${i}] 키`, envKeys.nth(i));
  }

  const envValues = page.locator(testId(WORKLOAD_SELECTOR.ENV_VALUE));
  const valueCount = await envValues.count();

  for (let i = 0; i < valueCount; i++) {
    await assertLogger.assertLocatorText(`환경변수[${i}] 값`, envValues.nth(i));
  }
});

Then("포트 정보가 표시된다", async ({ page, assertLogger }) => {
  const portNames = page.locator(testId(WORKLOAD_SELECTOR.PORT_NAME));
  const nameCount = await portNames.count();

  for (let i = 0; i < nameCount; i++) {
    await assertLogger.assertLocatorText(`포트[${i}] 이름`, portNames.nth(i));
  }

  const ports = page.locator(testId(WORKLOAD_SELECTOR.PORT_VALUE));
  const portCount = await ports.count();

  for (let i = 0; i < portCount; i++) {
    await assertLogger.assertLocatorText(`포트[${i}] 값`, ports.nth(i));
  }

  const portUrls = page.locator(testId(WORKLOAD_SELECTOR.PORT_URL));
  const urlCount = await portUrls.count();

  for (let i = 0; i < urlCount; i++) {
    await assertLogger.assertLocatorText(`포트[${i}] URL`, portUrls.nth(i));
  }
});

Then("생성자가 표시된다", async ({ page, assertLogger }) => {
  const creator = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_CREATOR));
  await assertLogger.assertLocatorText("생성자", creator);
});

Then(
  "생성일이 yyyy.MM.dd 형식으로 표시된다",
  async ({ page, assertLogger }) => {
    const createdDate = page.locator(
      testId(WORKLOAD_SELECTOR.DETAIL_CREATED_DATE),
    );
    await expect(createdDate).toBeVisible();
    const text = (await createdDate.textContent()) ?? "";
    assertLogger.assertMatch("생성일", text, /\d{4}\.\d{2}\.\d{2}/);
  },
);

Then("선택한 GPU 정보가 표시된다", async ({ page, assertLogger }) => {
  const gpuType = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_GPU_TYPE));
  await assertLogger.assertLocatorText("GPU 타입", gpuType);

  const gpuName = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_GPU_NAME));
  await assertLogger.assertLocatorText("GPU 이름", gpuName);

  const gpuMemory = page.locator(
    testId(WORKLOAD_SELECTOR.DETAIL_GPU_MEMORY_GB),
  );
  await assertLogger.assertLocatorText("GPU 메모리", gpuMemory);
});

Then("리소스 정보가 표시된다", async ({ page, assertLogger }) => {
  const gpuCount = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_GPU_COUNT));
  await assertLogger.assertLocatorText("GPU 개수", gpuCount);

  const cpuCore = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_CPU_CORE));
  await assertLogger.assertLocatorText("CPU 코어", cpuCore);

  const memoryGb = page.locator(testId(WORKLOAD_SELECTOR.DETAIL_MEMORY_GB));
  await assertLogger.assertLocatorText("메모리", memoryGb);
});

// ============================================
// 상태별 검증 Steps
// ============================================

const STATUS_MAP: Record<string, string> = {
  실행중: "running",
  대기중: "pending",
  종료: "completed",
  에러: "failed",
};

Given(
  "워크로드 상태가 {string}이다",
  async ({ page, $testInfo }, status: string) => {
    const statusElement = page.locator(testIdPrefix("workload-status-"));
    await expect(statusElement).toBeVisible();

    const testIdValue = await statusElement.getAttribute("data-testid");
    const currentStatus = testIdValue?.replace("workload-status-", "");
    const expectedStatus = STATUS_MAP[status] ?? status;

    if (currentStatus !== expectedStatus) {
      $testInfo.skip(
        true,
        `현재 워크로드 상태가 "${status}"이(가) 아니어서 시나리오를 스킵합니다 (현재: ${currentStatus})`,
      );
    }
  },
);
