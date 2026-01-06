import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";

/**
 * 허브 목록 페이지 Step Definitions
 *
 * 허브 페이지는 마스터-디테일 구조로, 목록과 상세가 동시에 표시됩니다.
 * - 진입점: /user/hub → 자동으로 첫 번째 허브 상세 페이지로 리다이렉트
 * - 실제 URL: /user/hub/[id]?name=hubName
 *
 * 구조:
 * 1. 페이지 진입
 * 2. 목록 영역 검증 (listGrid fixture)
 * 3. 상세 영역 검증 (hubPage POM)
 * 4. 카드 인터랙션
 * 5. 검색 (listSearchInput fixture)
 * 6. 데이터 유효성 검증
 *
 * NOTE: 워크로드의 list.steps.ts와 동일한 네이밍 컨벤션 적용
 */
const { Given, When, Then } = createBdd(test);

// ============================================
// 1. 페이지 진입
// ============================================

Given("허브 페이지에 있다", async ({ hubPage, page }) => {
  await hubPage.goto();
  // 첫 번째 허브로 자동 리다이렉트될 때까지 대기
  await page.waitForURL(/\/user\/hub\/\d+/);
});

When(
  /^ID가 "(.+)"이고 이름이 "(.+)"인 허브 페이지로 이동한다$/,
  async ({ hubPage }, hubId: string, hubName: string) => {
    await hubPage.gotoDetail(hubId, hubName);
  },
);

// ============================================
// 2. 페이지 표시 검증
// ============================================

Then("허브 페이지가 표시된다", async ({ hubPage }) => {
  await hubPage.assertPageVisible();
});

// NOTE: "카드형 그리드가 표시된다" step은 common/list.steps.ts에 정의됨
// NOTE: "목록 페이지의 그리드가 표시된다" step은 common/list.steps.ts에 정의됨

// ============================================
// 3. 목록 영역 검증 (listGrid fixture 활용)
// ============================================

Then("첫 번째 허브 카드가 선택된 상태이다", async ({ listGrid }) => {
  const firstCard = listGrid.getFirstCard();
  await expect(firstCard).toHaveAttribute("aria-selected", "true");
});

Then("두 번째 허브 카드가 선택된 상태이다", async ({ listGrid }) => {
  const secondCard = listGrid.getCard(1);
  await expect(secondCard).toHaveAttribute("aria-selected", "true");
});

Given(
  "허브 목록에 2개 이상의 데이터가 있다",
  async ({ listGrid, $testInfo }) => {
    const count = await listGrid.getCardCount();
    if (count < 2) {
      $testInfo.skip(true, "허브 카드가 2개 미만이어서 시나리오를 스킵합니다");
      return;
    }
  },
);

// ============================================
// 4. 상세 영역 검증
// ============================================

Then("허브 상세 이름이 표시된다", async ({ hubPage, assertLogger }) => {
  await hubPage.assertDetailNameVisible();
  const name = await hubPage.getDetailName();
  assertLogger.assertNotEmpty("허브 상세 이름", name);
});

Then("허브 README 콘텐츠가 표시된다", async ({ hubPage }) => {
  await hubPage.assertReadmeVisible();
});

Then(
  "허브 상세 이름이 변경된다",
  async ({ hubPage, listGrid, assertLogger }) => {
    await hubPage.assertDetailNameVisible();
    // 두 번째 카드의 제목과 상세 이름이 일치하는지 검증
    const secondCardTitle = await listGrid.getCardTitle(1);
    const detailName = await hubPage.getDetailName();
    assertLogger.assertEqual("허브 상세 이름", detailName, secondCardTitle);
  },
);

// ============================================
// 5. 카드 인터랙션 (listGrid fixture 활용)
// ============================================

When("두 번째 허브 카드를 클릭한다", async ({ listGrid }) => {
  await listGrid.clickCard(1);
});

// ============================================
// 6. 버튼 액션
// ============================================

When("허브에서 워크로드 생성 버튼을 클릭한다", async ({ hubPage }) => {
  await hubPage.clickCreateWorkloadButton();
});

// NOTE: "워크로드 생성 드로어가 표시된다" 스텝은 workload/detail.steps.ts에 정의됨

// ============================================
// 7. 검색 (listGrid + hubPage fixture 활용)
// ============================================

/**
 * 검색어가 포함된 데이터만 표시되는지 검증
 * - 첫 번째 결과가 검색어를 포함하는지 확인 (샘플 검증)
 *
 * NOTE: E2E 테스트는 기능 동작 확인이 목적이므로 첫 번째 결과만 검증
 * 전체 결과 정확성은 백엔드/API 테스트 영역
 */
Then(
  "허브 검색 결과 검색어가 포함된 데이터만 표시된다",
  async ({ listGrid, listSearchInput, assertLogger }) => {
    // 스켈레톤이 사라지고 카드가 표시될 때까지 대기
    await listGrid.assertCardsVisible();
    const cardCount = await listGrid.getCardCount();

    if (cardCount > 0) {
      const searchText = await listSearchInput.getValue();
      const firstCardTitle = await listGrid.getCardTitle(0);
      const containsSearch = firstCardTitle
        .toLowerCase()
        .includes(searchText.toLowerCase());
      assertLogger.assertEqual(
        `첫 번째 결과가 "${searchText}" 포함`,
        containsSearch,
        true,
      );
    }
  },
);

// ============================================
// 8. 데이터 유효성 검증 (listGrid fixture 활용)
// ============================================

Then(
  "각 허브 카드의 이름이 빈 값이 아니다",
  async ({ listGrid, assertLogger }) => {
    await listGrid.forEachCard(async (index) => {
      const name = await listGrid.getCardTitle(index);
      assertLogger.assertNotEmpty(`허브[${index}] 이름`, name);
    });
  },
);

Then(
  "각 허브 카드의 모델 타입이 빈 값이 아니다",
  async ({ listGrid, assertLogger }) => {
    await listGrid.forEachCard(async (index) => {
      const modelType = await listGrid.getCardDescription(index);
      assertLogger.assertNotEmpty(`허브[${index}] 모델 타입`, modelType);
    });
  },
);
