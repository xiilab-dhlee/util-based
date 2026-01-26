import { expect, type Locator, type Page } from "@playwright/test";

import { ROUTES } from "@/shared/constants/routes.constant";
import {
  testId,
  testIdPrefix,
  WORKLOAD_SELECTOR,
} from "@/shared/constants/selector.constant";
import { CardListComponent } from "../components/card-list.component";
import { TabsComponent } from "../components/tabs.component";
import { BasePage } from "./base.page";

/**
 * 워크로드 상세 페이지 Page Object
 *
 * BasePage를 상속하여 워크로드 상세 페이지 전용 기능 제공:
 * - 이벤트 카드, 소스코드 카드, 탭
 * - 기본 정보, Job 설정, 리소스 정보 등
 *
 * 상속 계층: BasePage > WorkloadDetailPage
 *
 * @example
 * const detailPage = new WorkloadDetailPage(page);
 * await detailPage.gotoWorkload("workload-123", "workspace-456");
 * await detailPage.tabs.clickTab("로그");
 */
export class WorkloadDetailPage extends BasePage {
  // ============================================
  // 도메인 상수 (Static)
  // ============================================

  /** 상세 페이지 버튼 셀렉터 */
  static readonly BUTTON: Record<string, string> = {
    수정: WORKLOAD_SELECTOR.DETAIL_EDIT_BUTTON,
    종료: WORKLOAD_SELECTOR.DETAIL_STOP_BUTTON,
    재시작: WORKLOAD_SELECTOR.DETAIL_RESTART_BUTTON,
    삭제: WORKLOAD_SELECTOR.DETAIL_DELETE_BUTTON,
    복제: WORKLOAD_SELECTOR.DETAIL_CLONE_BUTTON,
  };

  // ============================================
  // Instance Properties
  // ============================================

  /** 이벤트 카드 목록 */
  readonly eventCards: CardListComponent;
  /** 소스코드 카드 목록 */
  readonly sourcecodeCards: CardListComponent;
  /** 볼륨 카드 목록 */
  readonly volumeCards: CardListComponent;
  /** 탭 컴포넌트 */
  readonly tabs: TabsComponent;

  constructor(page: Page) {
    super(page);
    this.eventCards = new CardListComponent(page, WORKLOAD_SELECTOR.EVENT_CARD);
    this.sourcecodeCards = new CardListComponent(
      page,
      WORKLOAD_SELECTOR.SOURCECODE_CARD,
    );
    this.volumeCards = new CardListComponent(
      page,
      WORKLOAD_SELECTOR.VOLUME_CARD,
    );
    this.tabs = new TabsComponent(page);
  }

  // ============================================
  // Abstract 구현
  // ============================================

  protected get pageHeaderTestId(): string {
    return WORKLOAD_SELECTOR.PAGE_HEADER_DETAIL;
  }

  protected get basePath(): string {
    return ROUTES.USER_WORKLOAD;
  }

  // ============================================
  // Navigation (확장)
  // ============================================

  /**
   * 워크로드 상세 페이지로 이동
   * @param workloadId - 워크로드 ID
   * @param workspaceId - 워크스페이스 ID (optional)
   */
  async gotoWorkload(workloadId: string, workspaceId?: string): Promise<void> {
    const fullPath = workspaceId
      ? `${ROUTES.USER_WORKLOAD_DETAIL(workloadId)}?workspaceId=${workspaceId}`
      : ROUTES.USER_WORKLOAD_DETAIL(workloadId);
    await this.page.goto(fullPath);
    await this.page.waitForLoadState("networkidle");
  }

  // ============================================
  // Locators - 기본 정보
  // ============================================

  /** 워크로드 이름 */
  get name(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_NAME));
  }

  /** 워크로드 설명 */
  get description(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_DESCRIPTION));
  }

  /** 워크로드 상태 (동적 testId) */
  get status(): Locator {
    return this.page.locator(testIdPrefix("workload-status-"));
  }

  // ============================================
  // Locators - Job 설정 정보
  // ============================================

  /** Job Type 이름 */
  get jobTypeName(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_JOB_TYPE_NAME));
  }

  /** Job Type IDE */
  get jobTypeIde(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_JOB_TYPE_IDE));
  }

  /** 노드 타입 */
  get nodeTypeName(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_NODE_TYPE_NAME));
  }

  /** 이미지 타입 */
  get imageType(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_IMAGE_TYPE));
  }

  /** 이미지 이름 */
  get imageName(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_IMAGE_NAME));
  }

  /** Commit Image 생성 버튼 */
  get commitImageButton(): Locator {
    return this.page.locator(
      testId(WORKLOAD_SELECTOR.DETAIL_COMMIT_IMAGE_BUTTON),
    );
  }

  // ============================================
  // Locators - 수정 모달 관련
  // ============================================

  /** 수정 모달 이름 입력창 */
  get updateNameInput(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.UPDATE_NAME_INPUT));
  }

  /** 수정 모달 설명 입력창 */
  get updateDescriptionInput(): Locator {
    return this.page.locator(
      testId(WORKLOAD_SELECTOR.UPDATE_DESCRIPTION_INPUT),
    );
  }

  /** 복제 버튼 */
  get cloneButton(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_CLONE_BUTTON));
  }

  // ============================================
  // Locators - Commit Image 모달 관련
  // ============================================

  /** Commit Image 이름 입력창 */
  get commitImageNameInput(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.COMMIT_IMAGE_NAME_INPUT));
  }

  /** Commit Image 태그 입력창 */
  get commitImageTagInput(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.COMMIT_IMAGE_TAG_INPUT));
  }

  // ============================================
  // Locators - 보안검사 정보
  // ============================================

  /** 보안검사 Critical */
  get securityCritical(): Locator {
    return this.page.locator(
      testId(WORKLOAD_SELECTOR.DETAIL_SECURITY_LEVEL_CRITICAL),
    );
  }

  /** 보안검사 High */
  get securityHigh(): Locator {
    return this.page.locator(
      testId(WORKLOAD_SELECTOR.DETAIL_SECURITY_LEVEL_HIGH),
    );
  }

  /** 보안검사 Medium */
  get securityMedium(): Locator {
    return this.page.locator(
      testId(WORKLOAD_SELECTOR.DETAIL_SECURITY_LEVEL_MEDIUM),
    );
  }

  /** 보안검사 Low */
  get securityLow(): Locator {
    return this.page.locator(
      testId(WORKLOAD_SELECTOR.DETAIL_SECURITY_LEVEL_LOW),
    );
  }

  // ============================================
  // Locators - 실행 설정 정보
  // ============================================

  /** 실행 경로 */
  get execPath(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_EXEC_PATH));
  }

  /** 실행 명령어 */
  get execCommand(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_EXEC_COMMAND));
  }

  /** 환경변수 키 목록 */
  get envKeys(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.ENV_KEY));
  }

  /** 환경변수 값 목록 */
  get envValues(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.ENV_VALUE));
  }

  /** 포트 이름 목록 */
  get portNames(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.PORT_NAME));
  }

  /** 포트 값 목록 */
  get portValues(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.PORT_VALUE));
  }

  /** 포트 URL 목록 */
  get portUrls(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.PORT_URL));
  }

  // ============================================
  // Locators - 메타 정보
  // ============================================

  /** 생성자 */
  get creator(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_CREATOR));
  }

  /** 생성일 */
  get createdDate(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_CREATED_DATE));
  }

  // ============================================
  // Locators - GPU/리소스 정보
  // ============================================

  /** GPU 타입 */
  get gpuType(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_GPU_TYPE));
  }

  /** GPU 이름 */
  get gpuName(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_GPU_NAME));
  }

  /** GPU 메모리 */
  get gpuMemory(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_GPU_MEMORY_GB));
  }

  /** GPU 개수 */
  get gpuCount(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_GPU_COUNT));
  }

  /** CPU 코어 */
  get cpuCore(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_CPU_CORE));
  }

  /** 메모리 (GB) */
  get memoryGb(): Locator {
    return this.page.locator(testId(WORKLOAD_SELECTOR.DETAIL_MEMORY_GB));
  }

  // ============================================
  // Methods
  // ============================================

  /**
   * 워크로드 상태 값 반환
   * @returns 상태 값 (예: "running", "pending", "failed", "completed")
   */
  async getStatusValue(): Promise<string> {
    await expect(this.status).toBeVisible();
    const testIdValue = await this.status.getAttribute("data-testid");
    return testIdValue?.replace("workload-status-", "") ?? "";
  }

  /**
   * 보안검사 결과 Locator 배열 반환
   */
  getSecurityLevels(): { locator: Locator; name: string }[] {
    return [
      { locator: this.securityCritical, name: "Critical" },
      { locator: this.securityHigh, name: "High" },
      { locator: this.securityMedium, name: "Medium" },
      { locator: this.securityLow, name: "Low" },
    ];
  }

  /**
   * 버튼 Locator 반환
   * @param buttonTestId - 버튼 testId
   */
  getButton(buttonTestId: string): Locator {
    return this.page.locator(testId(buttonTestId));
  }

  // ============================================
  // 반복 처리 헬퍼 메서드
  // ============================================

  /**
   * Locator 목록을 순회하며 콜백 실행
   * @param locator - 순회할 Locator
   * @param callback - 각 요소에 대해 실행할 콜백
   */
  async forEachLocator<T>(
    locator: Locator,
    callback: (element: Locator, index: number) => Promise<T>,
  ): Promise<T[]> {
    const count = await locator.count();
    const results: T[] = [];

    for (let i = 0; i < count; i++) {
      results.push(await callback(locator.nth(i), i));
    }

    return results;
  }

  /**
   * Locator 목록의 텍스트를 순회하며 콜백 실행
   * @param locator - 순회할 Locator
   * @param callback - 각 텍스트에 대해 실행할 콜백
   */
  async forEachLocatorText<T>(
    locator: Locator,
    callback: (text: string, index: number) => T,
  ): Promise<T[]> {
    const count = await locator.count();
    const results: T[] = [];

    for (let i = 0; i < count; i++) {
      const text = ((await locator.nth(i).textContent()) ?? "").trim();
      results.push(callback(text, i));
    }

    return results;
  }

  /**
   * 단일 Locator의 텍스트 반환
   * @param locator - 텍스트를 가져올 Locator
   */
  async getLocatorText(locator: Locator): Promise<string> {
    return ((await locator.textContent()) ?? "").trim();
  }

  // ============================================
  // 버튼 클릭 액션 메서드
  // ============================================

  /**
   * 수정 버튼 클릭
   */
  async clickEditButton(): Promise<void> {
    const editButton = this.getButton(WORKLOAD_SELECTOR.DETAIL_EDIT_BUTTON);
    await expect(editButton).toBeVisible();
    await editButton.click();
  }

  /**
   * 종료 버튼 클릭
   */
  async clickStopButton(): Promise<void> {
    const stopButton = this.getButton(WORKLOAD_SELECTOR.DETAIL_STOP_BUTTON);
    await expect(stopButton).toBeVisible();
    await stopButton.click();
  }

  /**
   * 재시작 버튼 클릭
   */
  async clickRestartButton(): Promise<void> {
    const restartButton = this.getButton(
      WORKLOAD_SELECTOR.DETAIL_RESTART_BUTTON,
    );
    await expect(restartButton).toBeVisible();
    await restartButton.click();
  }

  /**
   * 삭제 버튼 클릭
   */
  async clickDeleteButton(): Promise<void> {
    const deleteButton = this.getButton(WORKLOAD_SELECTOR.DETAIL_DELETE_BUTTON);
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
  }

  /**
   * Commit Image 생성 버튼 클릭
   */
  async clickCommitImageButton(): Promise<void> {
    await expect(this.commitImageButton).toBeVisible();
    await this.commitImageButton.click();
  }

  /**
   * 복제 버튼 클릭
   */
  async clickCloneButton(): Promise<void> {
    await expect(this.cloneButton).toBeVisible();
    await this.cloneButton.click();
  }

  // ============================================
  // 수정 모달 관련 메서드
  // ============================================

  /**
   * 수정 모달의 이름 입력값 반환
   */
  async getUpdateNameInputValue(): Promise<string> {
    await expect(this.updateNameInput).toBeVisible();
    return (await this.updateNameInput.inputValue()) ?? "";
  }

  /**
   * 수정 모달의 설명 입력값 반환
   */
  async getUpdateDescriptionInputValue(): Promise<string> {
    await expect(this.updateDescriptionInput).toBeVisible();
    return (await this.updateDescriptionInput.inputValue()) ?? "";
  }
}
