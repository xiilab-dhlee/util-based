import { createBdd } from "playwright-bdd";

import { VALID_MODEL_TYPES } from "@/domain/hub/constants/hub.constant";
import { HUB_SELECTOR } from "@/shared/constants/selector.constant";
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
 * 2. 페이지 표시 검증
 * 3. 목록 영역 검증 (listGrid fixture)
 * 4. 상세 영역 검증 (hubPage POM)
 * 5. 카드 인터랙션
 * 6. 버튼 액션
 * 7. 데이터 유효성 검증
 */
const { Given, When, Then } = createBdd(test);

// ============================================
// 1. 페이지 진입
// ============================================

Given("허브 페이지에 있다", async ({ hubPage }) => {
  await hubPage.gotoAndWaitForRedirect();
});

When(
  "첫 번째 허브의 상세 페이지로 직접 이동한다",
  async ({ hubPage, listGrid }) => {
    // 목록에서 첫 번째 허브 정보 동적 추출
    await listGrid.assertCardsVisible();
    const firstCard = listGrid.getFirstCard();
    const hubId = await firstCard.getAttribute("data-hub-id");
    const hubName = await listGrid.getCardTitle(0);

    if (!hubId) {
      throw new Error("첫 번째 허브 카드에서 hub-id를 찾을 수 없습니다");
    }

    // URL로 직접 이동 (브라우저 주소창 입력 시뮬레이션)
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
  await listGrid.assertCardSelected(0);
});

Then("두 번째 허브 카드가 선택된 상태이다", async ({ listGrid }) => {
  await listGrid.assertCardSelected(1);
});

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
// 7. 데이터 유효성 검증 (listGrid fixture 활용)
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

Then(
  "각 허브 카드의 모델 타입이 허용된 값이다",
  async ({ listGrid, assertLogger }) => {
    await listGrid.forEachCard(async (index) => {
      const modelType = await listGrid.getCardDescription(index);
      assertLogger.assertContains(`허브[${index}] 모델 타입`, modelType, [
        ...VALID_MODEL_TYPES,
      ]);
    });
  },
);

Then("각 허브 카드의 썸네일이 표시된다", async ({ listGrid, assertLogger }) => {
  await listGrid.forEachCard(async (index) => {
    await listGrid.assertCardElementVisible(index, HUB_SELECTOR.THUMBNAIL);
    const src = await listGrid.getCardElementAttribute(
      index,
      HUB_SELECTOR.THUMBNAIL,
      "img",
      "src",
    );
    assertLogger.assertNotEmpty(`허브[${index}] 썸네일 src`, src);
  });
});

Then("각 허브 카드의 설명이 표시된다", async ({ listGrid, assertLogger }) => {
  await listGrid.forEachCard(async (index) => {
    await listGrid.assertCardElementVisible(index, HUB_SELECTOR.DESCRIPTION);
    const description = await listGrid.getCardElementText(
      index,
      HUB_SELECTOR.DESCRIPTION,
    );
    assertLogger.assertNotEmpty(`허브[${index}] 설명`, description);
  });
});
