# E2E 테스트 아키텍처

이 문서는 Kent Beck의 TDD/Tidy First 원칙을 기반으로 한 테스트 개발 방법론입니다.

> Feature/Scenario 작성법은 [gherkin-conventions.md](./gherkin-conventions.md)를 참조하세요.

---

## 핵심 원칙

### TDD (Test-Driven Development)

Red → Green → Refactor 사이클을 따릅니다:

1. **Red**: 실패하는 테스트(Feature/Scenario)를 먼저 작성
2. **Green**: 테스트를 통과하는 최소한의 Step/Page Object 작성
3. **Refactor**: 중복 제거 및 코드 개선 (테스트는 계속 통과)

### Tidy First (구조적 변경 우선)

모든 변경을 두 가지로 분리합니다:

| 구조적 변경 | 행동적 변경 |
|------------|------------|
| Step 파일 분리/병합 | 새 Scenario 추가 |
| Page Object 리팩토링 | 버그 수정 |
| import 정리, 이름 변경 | 새 Step 구현 |

**규칙**: 구조적 변경과 행동적 변경을 같은 커밋에 섞지 않습니다.

---

## 아키텍처 개요

```
tests/
├── features/           # BDD Feature 파일 (.feature)
│   └── {domain}/       # 도메인별 시나리오
├── steps/              # Step Definitions
│   ├── common.steps.ts # 공통 Steps
│   └── {domain}/       # 도메인별 Steps
├── pages/              # Page Objects
│   ├── base.page.ts    # 추상 기본 클래스
│   ├── list.page.ts    # 목록 페이지 공통
│   └── {domain}.page.ts
├── components/         # 재사용 UI 컴포넌트
├── fixtures.ts         # Playwright Fixtures
└── support/            # 헬퍼 (auth, hooks, patterns)
```

---

## Page Object Model

### BasePage (추상 클래스)

모든 Page Object의 기본 클래스입니다.

```typescript
// tests/pages/base.page.ts
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  // 하위 클래스에서 구현 필수
  protected abstract get pageHeaderTestId(): string;
  protected abstract get basePath(): string;

  // 공통 기능
  get pageHeader(): Locator { ... }
  async goto(path = ""): Promise<void> { ... }
  async assertPageVisible(timeout = 10000): Promise<void> { ... }
}
```

### 도메인 Page Object

```typescript
// tests/pages/{domain}.page.ts
export class WorkloadListPage extends ListPage {
  // 1. Static 상수 (도메인 매핑)
  static readonly STATUS_MAP: Record<string, string> = {
    실행중: "running",
    대기중: "pending",
  };

  // 2. 험블 객체 인스턴스 (readonly)
  readonly jobTypeFilter: DropdownComponent;
  readonly statusFilter: DropdownComponent;

  constructor(page: Page) {
    super(page);
    this.jobTypeFilter = new DropdownComponent(page, SELECTOR.JOB_TYPE);
    this.statusFilter = new DropdownComponent(page, SELECTOR.STATUS);
  }

  // 3. Abstract 구현 (필수)
  protected get pageHeaderTestId(): string { return WORKLOAD_SELECTOR.PAGE_HEADER; }
  protected get basePath(): string { return "/user/workload"; }

  // 4. 도메인 액션 (확장)
  async gotoDisabled(): Promise<void> { ... }
}
```

### SOLID 원칙 적용

| 원칙 | 적용 |
|------|------|
| **S**ingle Responsibility | 한 Page Object는 한 페이지만 담당 |
| **O**pen/Closed | BasePage 확장, 수정 없이 기능 추가 |
| **L**iskov Substitution | 하위 클래스가 상위 클래스 대체 가능 |
| **I**nterface Segregation | 컴포넌트별 인터페이스 분리 |
| **D**ependency Inversion | Page가 Component에 의존 (추상화) |

---

## Component Object (험블 객체 패턴)

험블 객체(Humble Object) 패턴을 적용하여 재사용 가능한 UI 컴포넌트를 캡슐화합니다.

### 험블 객체란?

험블 객체는 테스트하기 어려운 외부 의존성(DOM, 브라우저 API)을 캡슐화하여 테스트 가능한 인터페이스를 제공합니다.

```typescript
// tests/components/button.component.ts
export class ButtonComponent {
  constructor(
    private page: Page,
    private buttonTestId: string,
  ) {}

  // Locator는 private getter로 캡슐화
  private get locator(): Locator {
    return this.page.locator(testId(this.buttonTestId));
  }

  // Actions
  async click(): Promise<void> { await this.locator.click(); }
  async hover(): Promise<void> { await this.locator.hover(); }

  // Getters
  async getText(): Promise<string | null> { return await this.locator.textContent(); }
  async isEnabled(): Promise<boolean> { return await this.locator.isEnabled(); }

  // Assertions
  async assertVisible(timeout = 10000): Promise<void> {
    await expect(this.locator).toBeVisible({ timeout });
  }
  async assertDisabled(): Promise<void> {
    await expect(this.locator).toBeDisabled();
  }
}
```

### Page Object에서 험블 객체 사용

```typescript
// tests/pages/signup.page.ts
export class SignupPage extends BasePage {
  // 험블 객체를 인스턴스 속성으로 선언
  readonly emailField: FormItemComponent;
  readonly emailInput: InputComponent;
  readonly submitButton: ButtonComponent;
  readonly loginLink: LinkComponent;

  constructor(page: Page) {
    super(page);
    this.emailField = new FormItemComponent(page, AUTH_SELECTOR.SIGNUP_EMAIL_FIELD);
    this.emailInput = new InputComponent(page, AUTH_SELECTOR.SIGNUP_EMAIL_INPUT);
    this.submitButton = new ButtonComponent(page, AUTH_SELECTOR.SIGNUP_SUBMIT_BUTTON);
    this.loginLink = new LinkComponent(page, AUTH_SELECTOR.SIGNUP_LOGIN_LINK);
  }

  // 도메인 액션은 험블 객체를 조합하여 구현
  async fillEmail(value: string): Promise<void> {
    await this.emailInput.fill(value);
  }

  async assertFieldError(fieldName: string, message: string): Promise<void> {
    const fieldMap: Record<string, FormItemComponent> = {
      Email: this.emailField,
      // ...
    };
    await fieldMap[fieldName].assertErrorMessage(message);
  }
}
```

### 주요 Component 목록

| Component | 용도 | 주요 메서드 |
|-----------|------|-------------|
| `ButtonComponent` | 버튼 클릭, 상태 검증 | `click()`, `assertDisabled()`, `assertLoading()` |
| `InputComponent` | 입력 필드 조작 | `fill()`, `getValue()`, `assertValue()` |
| `FormItemComponent` | 폼 필드 컨테이너 (라벨+입력+에러) | `assertErrorMessage()`, `assertNoError()` |
| `DropdownComponent` | Ant Design Select 조작 | `select()`, `getSelectedValue()`, `assertEmpty()` |
| `LinkComponent` | 링크 클릭, href 검증 | `click()`, `assertHref()`, `assertExternalLink()` |
| `DataTableComponent` | 테이블 행 조작, 셀 텍스트 조회 | `getRowCount()`, `getRow()`, `clickRowButton()` |
| `PaginationComponent` | 페이지네이션 조작 | `goToPage()`, `assertCurrentPage()` |
| `ModalComponent` | 모달 확인/취소 | `confirm()`, `cancel()`, `assertVisible()` |
| `DrawerComponent` | 드로어 조작 | `close()`, `assertVisible()` |
| `TabsComponent` | 탭 전환 | `selectTab()`, `assertActiveTab()` |

### FormItem vs Input 분리

Ant Design의 Form 구조에 맞춰 FormItem(컨테이너)과 Input(실제 입력)을 분리합니다:

```text
FormItem (data-testid="signup-email-field")
├── Label
├── Input (data-testid="signup-email-input")
└── Error Message
```

| 컴포넌트 | 역할 | 검증 대상 |
|----------|------|----------|
| `FormItemComponent` | 라벨, 에러 메시지 포함 컨테이너 | 에러 메시지 표시 여부 |
| `InputComponent` | 실제 입력 필드 | 입력값, maxLength |

---

## Fixtures

Playwright Fixtures를 통해 Page Object와 컨텍스트를 주입합니다.

```typescript
// tests/fixtures.ts
export const test = base.extend<TestContextFixtures>({
  // 1. 컨텍스트 픽스처 (상태 공유)
  listContext: async ({}, use) => {
    const context = createInitialListContext();
    await use({
      ...context,
      setCurrentRow: (row) => { context.currentRow = row; },
      assertCurrentRow: () => {
        if (!context.currentRow) throw new Error("현재 선택된 행이 없습니다");
        return context.currentRow;
      },
    });
  },

  // 2. Page Object 픽스처
  workloadListPage: async ({ page }, use) => {
    await use(new WorkloadListPage(page));
  },

  // 3. 공통 컴포넌트 픽스처
  modal: async ({ page }, use) => {
    await use(new ModalComponent(page));
  },
});
```

### Fixture 사용 패턴

```typescript
// tests/steps/{domain}.steps.ts
const { Given, When, Then } = createBdd(test);

Given("목록에 워크로드가 있다", async ({ workloadListPage, listContext, $testInfo }) => {
  const count = await workloadListPage.table.getRowCount();
  if (count === 0) {
    $testInfo.skip(true, "워크로드가 없어 시나리오를 스킵합니다");
    return;
  }
  listContext.setCurrentRow(await workloadListPage.table.getFirstRow());
});
```

---

## Step Definition 작성 규칙

### 파일 구조

```typescript
// tests/steps/{domain}/{feature}.steps.ts
import { createBdd } from "playwright-bdd";
import { test } from "../../fixtures";

const { Given, When, Then } = createBdd(test);

// ============================================
// {섹션명}
// ============================================

// Given: 전제 조건 설정
Given("...", async ({ ... }) => { ... });

// When: 사용자 행동
When("...", async ({ ... }) => { ... });

// Then: 검증
Then("...", async ({ ... }) => { ... });
```

### 작성 원칙

1. **Page Object 메서드 사용**: Step에서 직접 locator 접근 지양
2. **데이터 없을 때 스킵**: `$testInfo.skip()` 처리
3. **의미 있는 검증 메시지**: `assertLogger` 활용

```typescript
// Good
Then("목록이 표시된다", async ({ workloadListPage }) => {
  await workloadListPage.assertPageVisible();
});

// Bad - 직접 locator 접근
Then("목록이 표시된다", async ({ page }) => {
  await expect(page.locator('[data-testid="..."]')).toBeVisible();
});
```

---

## 코드 품질 기준

### 명명 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| Feature 파일 | `{기능}-{목적}.feature` | `signup-entry.feature`, `signup-validation.feature` |
| Page Object | `{Domain}Page` | `SignupPage`, `WorkloadListPage` |
| Component | `{Name}Component` | `ButtonComponent`, `InputComponent` |
| Step 파일 | `{feature}.steps.ts` | `signup.steps.ts` |
| Static 상수 | `UPPER_SNAKE_CASE` | `STATUS_MAP` |

### Feature 파일 분리 패턴

| 접미사 | 목적 | 내용 |
|--------|------|------|
| `-entry` | 페이지 진입/렌더링 | UI 요소 표시 검증 |
| `-validation` | 유효성 검증 | 에러 메시지, 형식 검증 |
| `-interaction` | 인터랙션/성공 | 폼 제출, 버튼 동작 |

### 중복 제거 기준

| 조건 | 액션 |
|------|------|
| 2회 이상 반복되는 로직 | 헬퍼 함수로 추출 |
| 3개 이상 페이지에서 사용 | BasePage/공통 컴포넌트로 이동 |
| 도메인 간 공유 Step | `common.steps.ts`로 이동 |

---

## 커밋 규율

### 커밋 조건

1. 모든 테스트 통과 (`pnpm test:smoke`)
2. 모든 lint 경고 해결 (`pnpm lint`)
3. 단일 논리적 작업 단위

### 구조적/행동적 변경 분리 예시

```bash
# 구조적 변경 (먼저 커밋)
git commit -m "refactor(test): Step 파일을 도메인별로 분리"

# 행동적 변경 (이후 커밋)
git commit -m "test(workload): 필터 검증 시나리오 추가"
```

---

## 테스트 작성 체크리스트

### Feature 작성 전

- [ ] 테스트 목적이 명확한가?
- [ ] @smoke/@regression 태그 선택
- [ ] Background에 공통 전제 조건 정의

### Step 작성 시

- [ ] Page Object 메서드 사용 (직접 locator 접근 지양)
- [ ] 데이터 없을 때 `$testInfo.skip()` 처리
- [ ] assertLogger로 의미 있는 검증 메시지

### 커밋 전

- [ ] `pnpm test:smoke` 통과
- [ ] 구조적 변경과 행동적 변경 분리
- [ ] 불필요한 console.log 제거

---

## Selector 상수 사용

```typescript
// 올바른 사용
import { WORKLOAD_SELECTOR, testId } from "@/shared/constants/selector.constant";
page.locator(testId(WORKLOAD_SELECTOR.NAME));

// 잘못된 사용 (하드코딩 금지)
page.locator('[data-testid="workload-name"]');
```

---

## data-testid 설계 전략

### FormItem과 Input 분리

폼 필드는 컨테이너(FormItem)와 입력 요소(Input)를 별도로 식별합니다:

```typescript
// selector.constant.ts
export const AUTH_SELECTOR = {
  // FormItem (라벨 + 입력 + 에러 메시지 컨테이너)
  SIGNUP_EMAIL_FIELD: "signup-email-field",

  // Input (실제 입력창)
  SIGNUP_EMAIL_INPUT: "signup-email-input",
};
```

```tsx
// 컴포넌트에 적용
<FormItem data-testid={AUTH_SELECTOR.SIGNUP_EMAIL_FIELD}>
  <Input data-testid={AUTH_SELECTOR.SIGNUP_EMAIL_INPUT} />
</FormItem>
```

**분리 이유:**
- FormItem: 에러 메시지 검증 (`assertErrorMessage()`)
- Input: 입력값 검증 (`fill()`, `getValue()`, `assertValue()`)

---

## 참고 자료

- Kent Beck - "Tidy First?: A Personal Exercise in Empirical Software Design"
- Kent Beck - "Test-Driven Development: By Example"
- Gerard Meszaros - "xUnit Test Patterns" (Humble Object 패턴)
- [Gherkin 컨벤션](./gherkin-conventions.md)
- [Playwright-BDD](https://vitalets.github.io/playwright-bdd/)
