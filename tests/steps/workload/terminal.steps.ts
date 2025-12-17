import { createBdd } from "playwright-bdd";

import { ThemePopoverComponent } from "../../components/theme-popover.component";
import { test } from "../../fixtures";

/**
 * 워크로드 웹터미널 페이지 Step Definitions
 *
 * 웹터미널 페이지 관련 인터랙션:
 * - 테마 적용 결과 확인
 * - 터미널 패널 분할
 *
 * NOTE: 테마 변경/모니터링 패널 관련 step은 common.steps.ts에서 공통 관리
 */
const { When, Then } = createBdd(test);

// ============================================
// 테마 변경 결과 확인 Steps
// ============================================

Then(
  "웹터미널 영역에 선택한 테마가 표시된다",
  async ({ workloadTerminalPage }) => {
    await workloadTerminalPage.assertThemeApplied(
      ThemePopoverComponent.THEME_NAMES,
    );
  },
);

// ============================================
// 터미널 패널 분할 Steps
// ============================================

Then(
  "웹터미널 패널이 {int}개 표시된다",
  async ({ workloadTerminalPage }, count: number) => {
    await workloadTerminalPage.assertTerminalPanelCount(count);
  },
);

When("수직 분할 버튼을 클릭한다", async ({ workloadTerminalPage }) => {
  await workloadTerminalPage.clickSplitVertical();
});

When("수평 분할 버튼을 클릭한다", async ({ workloadTerminalPage }) => {
  await workloadTerminalPage.clickSplitHorizontal();
});
