import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";

/**
 * 네비게이션 Step Definitions
 *
 * 페이지 위치 및 네비게이션 메뉴 관련 Step 정의
 */

const { Then } = createBdd(test);

// ============================================
// 네비게이션 메뉴
// ============================================

Then(
  "네비게이션 메뉴 중 {string} 메뉴가 선택되어 있다",
  async ({ navigation }, menuName: string) => {
    await navigation.assertSelectedMenu(menuName);
  },
);
