import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";

/**
 * 워크로드 웹터미널 페이지 Step Definitions
 *
 * 구조:
 * 1. 테마 변경 결과 확인
 * 2. 터미널 패널 분할
 *
 * NOTE: 테마 변경/모니터링 패널 관련 step은 common.steps.ts에서 공통 관리
 */
const { When, Then } = createBdd(test);

Then(
  "워크로드 웹터미널 페이지가 표시된다",
  async ({ workloadTerminalPage }) => {
    await workloadTerminalPage.assertPageVisible();
  },
);

// ============================================
// 1. 테마 변경 결과 확인
// ============================================

Then(
  "웹터미널 영역에 선택한 테마가 표시된다",
  async ({ workloadTerminalPage, themeContext }) => {
    // 선택된 테마를 context에서 가져옴
    const selectedTheme = themeContext.assertSelectedTheme();

    // 선택한 테마 클래스가 정확히 적용되었는지 확인
    await workloadTerminalPage.assertThemeApplied([selectedTheme]);
  },
);

// ============================================
// 2. 터미널 패널 분할
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
