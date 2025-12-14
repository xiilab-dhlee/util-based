import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Ant Design Radio Component Object (험블 객체)
 *
 * Ant Design Radio 컴포넌트 조작을 캡슐화
 * - 라디오 선택/해제
 * - 선택 상태 확인
 * - 특정 컨테이너 내 라디오 조작
 *
 * @example
 * const radio = new RadioComponent(page);
 * await radio.selectFirst(containerLocator);
 * await radio.assertChecked(containerLocator, 0);
 */
export class RadioComponent {
  /** Ant Design Radio wrapper 셀렉터 (클릭 가능한 요소) */
  private static readonly RADIO_WRAPPER = ".ant-radio-wrapper";
  /** Ant Design Radio input 셀렉터 (상태 확인용) */
  private static readonly RADIO_INPUT = ".ant-radio-input";

  constructor(private page: Page) {}

  /**
   * 컨테이너 내 모든 라디오 버튼 Locator (클릭용)
   *
   * @param container - 라디오를 포함하는 컨테이너 Locator
   */
  private getRadioWrappers(container: Locator): Locator {
    return container.locator(RadioComponent.RADIO_WRAPPER);
  }

  /**
   * 컨테이너 내 모든 라디오 input Locator (상태 확인용)
   *
   * @param container - 라디오를 포함하는 컨테이너 Locator
   */
  private getRadioInputs(container: Locator): Locator {
    return container.locator(RadioComponent.RADIO_INPUT);
  }

  /**
   * 컨테이너 내 첫 번째 라디오 버튼 선택
   *
   * @param container - 라디오를 포함하는 컨테이너 Locator
   */
  async selectFirst(container: Locator): Promise<void> {
    const radio = this.getRadioWrappers(container).first();
    await expect(radio).toBeVisible({ timeout: 10000 });
    await radio.click();
  }

  /**
   * 컨테이너 내 특정 인덱스의 라디오 버튼 선택
   *
   * @param container - 라디오를 포함하는 컨테이너 Locator
   * @param index - 선택할 라디오 인덱스 (0-based)
   */
  async selectByIndex(container: Locator, index: number): Promise<void> {
    const radio = this.getRadioWrappers(container).nth(index);
    await expect(radio).toBeVisible({ timeout: 10000 });
    await radio.click();
  }

  /**
   * 특정 행(row) 내의 라디오 버튼 선택
   *
   * @param row - 라디오를 포함하는 행 Locator
   */
  async selectInRow(row: Locator): Promise<void> {
    const radio = row.locator(RadioComponent.RADIO_WRAPPER);
    await expect(radio).toBeVisible({ timeout: 10000 });
    await radio.click();
  }

  /**
   * 라디오 버튼 선택 상태 확인
   *
   * @param container - 라디오를 포함하는 컨테이너 Locator
   * @param index - 확인할 라디오 인덱스 (0-based)
   */
  async assertChecked(container: Locator, index: number): Promise<void> {
    const radio = this.getRadioInputs(container).nth(index);
    await expect(radio).toBeChecked();
  }

  /**
   * 라디오 버튼 미선택 상태 확인
   *
   * @param container - 라디오를 포함하는 컨테이너 Locator
   * @param index - 확인할 라디오 인덱스 (0-based)
   */
  async assertNotChecked(container: Locator, index: number): Promise<void> {
    const radio = this.getRadioInputs(container).nth(index);
    await expect(radio).not.toBeChecked();
  }

  /**
   * 컨테이너 내 라디오 버튼 개수 반환
   *
   * @param container - 라디오를 포함하는 컨테이너 Locator
   */
  async getCount(container: Locator): Promise<number> {
    return await this.getRadioWrappers(container).count();
  }
}
