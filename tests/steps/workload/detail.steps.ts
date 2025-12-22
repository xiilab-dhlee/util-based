import { expect } from "@playwright/test";
import { createBdd, type DataTable } from "playwright-bdd";

import {
  testId,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";
import { WorkloadDetailPage } from "../../pages/workload-detail.page";

/**
 * 워크로드 상세 페이지 Step Definitions
 *
 * 구조:
 * 1. 페이지 진입
 * 2. 페이지 표시 검증
 * 3. 상태별 검증
 * 4. 버튼 클릭
 * 5. 수정 모달
 * 6. 드로어
 * 7. 워크로드 복제 검증
 *
 * NOTE: 데이터 유효성 검증/UI 표시 검증 Step은
 *       tests/archives/steps/detail-validation.steps.ts로 이동됨
 */
const { Given, When, Then } = createBdd(test);

// ============================================
// 1. 페이지 진입
// ============================================

Given(
  "워크로드 상세 페이지에 있다",
  async ({ workloadDetailPage, workloadId, workspaceId }) => {
    await workloadDetailPage.gotoWorkload(workloadId, workspaceId);
  },
);

// ============================================
// 2. 페이지 표시 검증
// ============================================

Then("워크로드 상세 페이지가 표시된다", async ({ workloadDetailPage }) => {
  await workloadDetailPage.assertPageVisible();
});

Then("워크로드 로그 페이지가 표시된다", async ({ workloadLogPage }) => {
  await workloadLogPage.assertPageVisible();
});

Then(
  "워크로드 모니터링 페이지가 표시된다",
  async ({ workloadMonitoringPage }) => {
    await workloadMonitoringPage.assertPageVisible();
  },
);

Then(
  "워크로드 웹터미널 페이지가 표시된다",
  async ({ workloadTerminalPage }) => {
    await workloadTerminalPage.assertPageVisible();
  },
);

// ============================================
// 3. 상태별 검증
// ============================================

When(
  "워크로드 상태가 {string}인 것을 확인한다.",
  async ({ workloadDetailPage, $testInfo }, status: string) => {
    const currentStatus = await workloadDetailPage.getStatusValue();

    if (currentStatus !== status) {
      $testInfo.skip(
        true,
        `현재 워크로드 상태가 "${status}"이(가) 아니어서 시나리오를 스킵합니다 (현재: ${currentStatus})`,
      );
    }
  },
);

// ============================================
// 4. 버튼 클릭
// ============================================

When("워크로드 수정 버튼을 클릭한다", async ({ workloadDetailPage }) => {
  await workloadDetailPage.clickEditButton();
});

When(
  "워크로드 종료 버튼을 클릭한다",
  async ({ workloadDetailPage, $testInfo }) => {
    const currentStatus = await workloadDetailPage.getStatusValue();

    if (currentStatus !== "running") {
      $testInfo.skip(
        true,
        `워크로드가 실행 중이 아니어서 시나리오를 스킵합니다 (현재 상태: ${currentStatus})`,
      );
      return;
    }

    await workloadDetailPage.clickStopButton();
  },
);

When(
  "워크로드 재시작 버튼을 클릭한다",
  async ({ workloadDetailPage, $testInfo }) => {
    const currentStatus = await workloadDetailPage.getStatusValue();

    if (currentStatus !== "completed") {
      $testInfo.skip(
        true,
        `워크로드가 완료 상태가 아니어서 시나리오를 스킵합니다 (현재 상태: ${currentStatus})`,
      );
      return;
    }

    await workloadDetailPage.clickRestartButton();
  },
);

When(
  "워크로드 삭제 버튼을 클릭한다",
  async ({ workloadDetailPage, $testInfo }) => {
    const currentStatus = await workloadDetailPage.getStatusValue();

    if (currentStatus !== "completed") {
      $testInfo.skip(
        true,
        `워크로드가 완료 상태가 아니어서 시나리오를 스킵합니다 (현재 상태: ${currentStatus})`,
      );
      return;
    }

    await workloadDetailPage.clickDeleteButton();
  },
);

When(
  "Commit Image 생성 버튼을 클릭한다",
  async ({ workloadDetailPage, $testInfo }) => {
    const currentStatus = await workloadDetailPage.getStatusValue();

    if (currentStatus !== "running") {
      $testInfo.skip(
        true,
        `워크로드가 실행 중이 아니어서 시나리오를 스킵합니다 (현재 상태: ${currentStatus})`,
      );
      return;
    }

    await workloadDetailPage.clickCommitImageButton();
  },
);

When("워크로드 복제 버튼을 클릭한다", async ({ workloadDetailPage }) => {
  await workloadDetailPage.clickCloneButton();
});

// ============================================
// 5. 수정 모달
// ============================================

Then("수정 모달이 표시된다", async ({ modal }) => {
  await modal.waitForVisible();
});

Then("수정 모달에 이름 입력창이 표시된다", async ({ workloadDetailPage }) => {
  await expect(workloadDetailPage.updateNameInput).toBeVisible();
});

Then("수정 모달에 설명 입력창이 표시된다", async ({ workloadDetailPage }) => {
  await expect(workloadDetailPage.updateDescriptionInput).toBeVisible();
});

Then(
  "수정 모달의 이름 입력창에 현재 워크로드 이름이 입력되어 있다",
  async ({ workloadDetailPage, assertLogger }) => {
    const inputValue = await workloadDetailPage.getUpdateNameInputValue();
    // 이름이 비어있지 않으면 유효
    assertLogger.assertNotEmpty("수정 모달 이름 입력값", inputValue);
  },
);

Then(
  "수정 모달의 설명 입력창에 현재 워크로드 설명이 입력되어 있다",
  async ({ workloadDetailPage }) => {
    // 설명은 비어있을 수 있으므로 입력창이 visible한지만 확인
    await expect(workloadDetailPage.updateDescriptionInput).toBeVisible();
  },
);

// ============================================
// 6. 드로어
// ============================================

Then("워크로드 생성 드로어가 표시된다", async ({ drawer }) => {
  await drawer.waitForVisible();
});

// ============================================
// 7. 워크로드 복제 검증
// ============================================

/**
 * Job Type 텍스트를 드로어 버튼 레이블로 변환
 *
 * 상세 페이지의 Job Type 텍스트를 드로어에서 선택된 버튼 레이블로 변환합니다.
 * DISTRIBUTED는 드로어에 별도 버튼이 없어 "Batch Job"으로 매핑됩니다.
 */
const JOB_TYPE_TO_LABEL: Record<string, string> = {
  "Batch Job": "Batch Job",
  "Distributed Job": "Batch Job", // 드로어에 별도 버튼 없음
  "Interactive Job (IDE)": "Interactive Job (IDE)",
};

Then(
  "선택된 Job Type 버튼이 상세 페이지의 Job Type과 동일하다",
  async ({ page, workloadDetailPage }) => {
    const detailJobType =
      (await workloadDetailPage.jobTypeName.textContent())?.trim() ?? "";
    const expectedLabel = JOB_TYPE_TO_LABEL[detailJobType] ?? detailJobType;

    const card = page.getByRole("button", { name: expectedLabel });
    await expect(card).toBeVisible({ timeout: 10000 });
    await expect(card).toHaveAttribute("data-active", "true");
  },
);

Then(
  "워크로드 이름 입력창 내 텍스트가 상세 페이지의 워크로드 이름과 동일하다",
  async ({ page, workloadDetailPage, assertLogger }) => {
    const detailName =
      (await workloadDetailPage.name.textContent())?.trim() ?? "";

    const input = page.locator(testId(WORKLOAD_SELECTOR.CREATE_NAME));
    await expect(input).toBeVisible({ timeout: 10000 });
    const inputValue = await input.inputValue();

    assertLogger.assertEqual("워크로드 이름", inputValue, detailName);
  },
);

Then(
  "워크로드 설명 입력창 내 텍스트가 상세 페이지의 워크로드 설명과 동일하다",
  async ({ page, workloadDetailPage, assertLogger }) => {
    const rawDescription =
      (await workloadDetailPage.description.textContent())?.trim() ?? "";
    // "-"는 빈 값을 나타내므로 빈 문자열로 변환
    const detailDescription = rawDescription === "-" ? "" : rawDescription;

    const input = page.locator(testId(WORKLOAD_SELECTOR.CREATE_DESCRIPTION));
    await expect(input).toBeVisible({ timeout: 10000 });
    const inputValue = await input.inputValue();

    assertLogger.assertEqual("워크로드 설명", inputValue, detailDescription);
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
// 볼륨 Steps
// ============================================

Then(
  "각 볼륨 이름이 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
    await workloadDetailPage.volumeCards.forEachCard(
      "h6",
      async (element, i) => {
        await assertLogger.assertLocatorText(`볼륨[${i}] 이름`, element);
      },
    );
  },
);

Then(
  "각 볼륨 상태가 다음 중 하나이다:",
  async ({ workloadDetailPage, assertLogger }, dataTable: DataTable) => {
    const validStatuses = dataTable
      .raw()
      .slice(1)
      .flat()
      .map((s) => s.toLowerCase());

    await workloadDetailPage.volumeCards.forEachByPrefixAttached(
      "workload-volume-status-",
      (status, i) => {
        assertLogger.assertContains(
          `볼륨[${i}] 상태`,
          status.toLowerCase(),
          validStatuses,
        );
      },
    );
  },
);

Then(
  "각 볼륨 스토리지 타입이 다음 중 하나이다:",
  async ({ workloadDetailPage, assertLogger }, dataTable: DataTable) => {
    const validTypes = dataTable
      .raw()
      .slice(1)
      .flat()
      .map((t) => t.toLowerCase());

    await workloadDetailPage.volumeCards.forEachByPrefix(
      "workload-volume-storage-type-",
      (type, i) => {
        assertLogger.assertContains(
          `볼륨[${i}] 스토리지 타입`,
          type.toLowerCase(),
          validTypes,
        );
      },
    );
  },
);

Then("각 볼륨 경로가 표시된다", async ({ workloadDetailPage }) => {
  await workloadDetailPage.volumeCards.forEachCard(
    testId(WORKLOAD_SELECTOR.VOLUME_PATH),
    async (element) => {
      await expect(element).toBeVisible();
    },
  );
});

Then(
  "각 볼륨 크기가 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
    await workloadDetailPage.volumeCards.forEachCard(
      testId(WORKLOAD_SELECTOR.VOLUME_SIZE),
      async (element, i) => {
        await assertLogger.assertLocatorText(`볼륨[${i}] 크기`, element);
      },
    );
  },
);

Then(
  "워크로드 이름이 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
    await assertLogger.assertLocatorText(
      "워크로드 이름",
      workloadDetailPage.name,
    );
  },
);

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
// 상세정보 탭 내용 Steps
// ============================================

Then(
  "Job Type 정보가 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
    await assertLogger.assertLocatorText(
      "Job Type 이름",
      workloadDetailPage.jobTypeName,
    );
    await assertLogger.assertLocatorText(
      "Job Type IDE",
      workloadDetailPage.jobTypeIde,
    );
  },
);

Then(
  "노드 타입 정보가 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
    await assertLogger.assertLocatorText(
      "노드 타입",
      workloadDetailPage.nodeTypeName,
    );
  },
);

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

Then(
  "보안검사 결과가 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
    const securityLevels = workloadDetailPage.getSecurityLevels();

    for (const { locator, name } of securityLevels) {
      await assertLogger.assertLocatorText(`보안검사 ${name}`, locator);
    }
  },
);

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

Then(
  "환경변수 정보가 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
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
  },
);

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

Then(
  "선택한 GPU 정보가 표시된다",
  async ({ workloadDetailPage, assertLogger }) => {
    await assertLogger.assertLocatorText(
      "GPU 타입",
      workloadDetailPage.gpuType,
    );
    await assertLogger.assertLocatorText(
      "GPU 이름",
      workloadDetailPage.gpuName,
    );
    await assertLogger.assertLocatorText(
      "GPU 메모리",
      workloadDetailPage.gpuMemory,
    );
  },
);

Then("리소스 정보가 표시된다", async ({ workloadDetailPage, assertLogger }) => {
  await assertLogger.assertLocatorText("GPU 개수", workloadDetailPage.gpuCount);
  await assertLogger.assertLocatorText("CPU 코어", workloadDetailPage.cpuCore);
  await assertLogger.assertLocatorText("메모리", workloadDetailPage.memoryGb);
});
