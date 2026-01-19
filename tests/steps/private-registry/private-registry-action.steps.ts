import { createBdd } from "playwright-bdd";

import { PRIVATE_REGISTRY_SELECTOR } from "@/shared/constants/selector.constant";
import { test } from "../../fixtures";

/**
 * 개인 레지스트리 액션 Step Definitions
 *
 * 구조:
 * 1. 체크박스 및 삭제 기능
 * 2. 등록 중인 이미지 재시작/종료
 */
const { Given, When } = createBdd(test);

// ============================================
// 1. 체크박스 및 삭제 기능
// ============================================

When(
  "첫 번째 개인 레지스트리의 체크박스를 클릭한다",
  async ({ privateRegistryListPage }) => {
    await privateRegistryListPage.table.clickRowCheckbox(0);
  },
);

// ============================================
// 2. 등록 중인 이미지 재시작/종료
// ============================================

Given(
  "등록 중인 이미지 목록에 1개 이상의 데이터가 있다",
  async ({ privateRegistryListPage }) => {
    await privateRegistryListPage.jobListGrid.assertCardsVisible();
    await privateRegistryListPage.jobListGrid.assertMinCardCount(1);
  },
);

When(
  "첫 번째 등록 중인 이미지의 드롭다운 버튼을 클릭한다",
  async ({ privateRegistryListPage }) => {
    await privateRegistryListPage.jobListGrid.clickCardButton(
      0,
      PRIVATE_REGISTRY_SELECTOR.JOB_LIST_CARD_DROPDOWN_TRIGGER,
    );
  },
);

When(
  "등록 중인 이미지의 재시작 버튼을 클릭한다",
  async ({ privateRegistryListPage }) => {
    await privateRegistryListPage.jobListGrid.clickDropdownMenuItem(
      PRIVATE_REGISTRY_SELECTOR.JOB_LIST_RESTART_BUTTON,
    );
  },
);

When(
  "등록 중인 이미지의 종료 버튼을 클릭한다",
  async ({ privateRegistryListPage }) => {
    await privateRegistryListPage.jobListGrid.clickDropdownMenuItem(
      PRIVATE_REGISTRY_SELECTOR.JOB_LIST_STOP_BUTTON,
    );
  },
);
