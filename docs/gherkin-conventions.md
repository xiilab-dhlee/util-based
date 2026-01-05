# Gherkin E2E 테스트 컨벤션

Playwright-BDD를 사용한 E2E 테스트 작성 규칙입니다.

> 테스트 아키텍처 및 개발 원칙은 [test-architecture.md](./test-architecture.md)를 참조하세요.

---

## 파일 구조

```
tests/
├── features/              # Feature 파일
│   └── {도메인}/
│       ├── {기능}-entry.feature        # 페이지 진입/렌더링 검증
│       ├── {기능}-validation.feature   # 유효성 검증 시나리오
│       └── {기능}-interaction.feature  # 인터랙션/성공 케이스
├── steps/                 # Step 정의
│   ├── common.steps.ts    # 공통 Step
│   └── {도메인}/
│       └── {기능}.steps.ts  # 기능별 Step
├── pages/                 # Page Objects
├── components/            # 험블 객체 (재사용 컴포넌트)
└── support/               # 헬퍼
    └── auth.helper.ts
```

---

## Feature 작성 규칙

### User Story 형식 필수

Feature 설명은 반드시 **As a / I want to / So that** 형식으로 작성합니다.

```gherkin
Feature: 사용자 모니터링 페이지 진입
  As a 사용자,
  I want to 메인(모니터링) 페이지에 진입하면
  So that 선택된 워크스페이스 기준으로 모니터링 화면을 바로 조회할 수 있다
```

### Background 사용

공통 전제 조건은 Background에 정의합니다. Background는 모든 Scenario에 적용됩니다.

```gherkin
Background:
  When 사용자가 모니터링 페이지로 진입한다
  And 워크스페이스가 선택되어 있다
```

### 파일 분리 기준

테스트 목적에 따라 Feature 파일을 분리합니다:

| 파일 | 용도 | 예시 |
|------|------|------|
| `{기능}-entry.feature` | 페이지 진입, UI 렌더링 검증 | 필드 표시, 버튼 표시 |
| `{기능}-validation.feature` | 유효성 검증, 에러 메시지 | 필수값 검증, 형식 검증 |
| `{기능}-interaction.feature` | 인터랙션, 성공 케이스 | 폼 제출, maxLength 검증 |

**분리 기준:**
- **entry**: "화면이 올바르게 표시되는가?" (렌더링 검증)
- **validation**: "잘못된 입력을 어떻게 처리하는가?" (에러 케이스)
- **interaction**: "정상 동작이 올바르게 수행되는가?" (성공 케이스)

---

## 태그 규칙

### Feature 레벨 태그

Feature 파일의 첫 줄에 도메인 태그를 추가합니다:

```gherkin
@workload-detail @interaction
Feature: 워크로드 상세 페이지 인터랙션
```

| 태그 | 용도 | 예시 |
|------|------|------|
| `@{도메인}` | 도메인 분류 | `@workload`, `@monitoring` |
| `@{도메인}-{기능}` | 세부 기능 분류 | `@workload-detail`, `@workload-create` |
| `@interaction` | UI 인터랙션 테스트 (스크린샷 캡처) | - |

### Scenario 레벨 태그

| 태그 | 용도 | 설명 |
|------|------|------|
| `@smoke` | 핵심 기능 검증 | 페이지 로딩, 기본 UI 표시 확인 |
| `@regression` | 회귀 테스트 | 데이터 유효성, 비즈니스 로직 검증 |
| `@edge-case` | 예외/경계 케이스 | API 오류, 빈 목록, 경계값 테스트 |
| `@skip` | 테스트 스킵 | 미구현/비활성화 |

**@smoke vs @regression 판단 기준:**

| 기준 | @smoke | @regression |
|------|--------|-------------|
| 목적 | "시스템이 동작하는가?" | "기존 기능이 정상인가?" |
| 범위 | 페이지 로딩, 기본 UI 표시 | 데이터 형식, 버튼 상태, 로직 검증 |
| 실패 의미 | 시스템 자체에 심각한 문제 | 특정 기능에 회귀 버그 발생 |

---

## 공통 Step 목록

`tests/steps/common.steps.ts`에 정의된 Step입니다. 새 Feature 작성 시 이 Step들을 우선 사용합니다.

### 인증

| Step | 용도 |
|------|------|
| `Given 사용자는 로그인 상태이다` | 일반 사용자(user)로 로그인 |
| `Then 로그인 페이지로 리다이렉트된다` | 로그인 리다이렉트 확인 |

### 워크스페이스

| Step | 용도 |
|------|------|
| `Given/And 워크스페이스가 선택되어 있다` | 워크스페이스 선택 상태 확인 |
| `Given/And 워크스페이스가 선택되어 있지 않다` | 워크스페이스 미선택 상태 확인 |
| `Then 워크스페이스 선택 안내가 표시된다` | 워크스페이스 안내 UI 확인 |

### URL

| Step | 용도 |
|------|------|
| `Then URL이 "{path}"를 포함한다` | URL 부분 일치 검증 |

### 목록 페이지

| Step | 용도 |
|------|------|
| `Then 목록 테이블이 표시된다` | 목록 테이블 표시 확인 |
| `Then 목록에 총 개수가 표시된다` | 총 개수 표시 확인 |
| `Then 페이지네이션이 표시된다` | 페이지네이션 표시 확인 |
| `Then 검색창이 빈 값으로 표시된다` | 검색창 빈 값 확인 |

---

## data-testid 규칙

> 전체 셀렉터 목록은 [data-testid-registry.md](./data-testid-registry.md)를 참조하세요.

### 네이밍 컨벤션

```
{도메인}-{컴포넌트}-{역할}
{도메인}-{컴포넌트}-{id}
```

### PageHeader

PageHeader 컴포넌트는 `pageKey`를 그대로 `data-testid`로 사용합니다.

```tsx
<PageHeader pageKey="user.monitoring" />
// -> data-testid="user.monitoring"
```

---

## Step 구현 패턴

### DataTable 파싱

Gherkin의 DataTable을 사용하여 유효한 값 목록을 검증할 수 있습니다.

```gherkin
Then 값이 다음 중 하나이다:
  | 값     |
  | value1 |
  | value2 |
```

```typescript
import { createBdd, type DataTable } from "playwright-bdd";

Then("값이 다음 중 하나이다:", async ({ page }, dataTable: DataTable) => {
  // DataTable 파싱: raw() → slice(1) → flat()
  const validValues = dataTable.raw().slice(1).flat();
  // ...
});
```

- `DataTable` 타입은 `playwright-bdd`에서 import
- `.raw()`는 2차원 배열 반환
- `.slice(1)`로 헤더 행 제외
- `.flat()`으로 1차원 배열 변환

### 차트 컴포넌트 (ApexCharts)

컨테이너 visibility + canvas 렌더링 완료를 함께 확인합니다.

```typescript
const container = page.locator('[data-testid="..."]');
await expect(container).toBeVisible({ timeout: 10000 });

const chart = container.locator(".apexcharts-canvas");
await expect(chart).toBeVisible({ timeout: 10000 });
```

### 테이블 컴포넌트 (Ant Design Table)

| 검증 방법 | 셀렉터 | 사용 시점 |
|----------|--------|----------|
| 기본 | `.ant-table-tbody` | 테이블 렌더링 확인 |
| 엄격 | `.ant-table-tbody tr.ant-table-row` | 데이터 로드 확인 |

### Dropdown 필터 (Ant Design Select)

빈 값 상태는 placeholder visibility로 확인합니다.

```typescript
const placeholder = filter.locator(".ant-select-selection-placeholder");
await expect(placeholder).toBeVisible();
```

### Scenario Outline 활용

동일한 검증 로직에 여러 입력값을 테스트할 때 `Scenario Outline`과 `Examples`를 사용합니다:

```gherkin
@regression
Scenario Outline: Password 정책 미충족 - <case>
  Given Password를 제외한 필수값이 유효하게 입력되어 있다
    | field      | value            |
    | Email      | user1@xiilab.com |
    | First Name | 길동             |
    | Last Name  | 홍               |
  When Password 필드에 "<password>"을 입력한다
  And Confirm Password 필드에 "<password>"을 입력한다
  And 회원가입 버튼을 클릭한다
  Then Password 필드에 "<expectedError>" 에러 메시지가 표시된다

  Examples:
    | case               | password          | expectedError                                          |
    | 영문만 사용        | aaaaaaaa          | Password must contain at least one number              |
    | 숫자만 사용        | 12345678          | Password must contain at least one letter              |
    | 특수문자만 사용    | !@#$%^&*          | Password must contain at least one letter and number   |
```

**장점:**
- 중복 시나리오 제거
- 테스트 케이스 가시성 향상
- 새 케이스 추가 용이

---

## 테스트 실행

```bash
# 분류별 실행
pnpm test:smoke            # Smoke 테스트만
pnpm test:regression       # Regression 테스트만

# 특정 유스케이스 실행
pnpm test:uc @TESTUC-5

# 디버깅
pnpm test:ui               # UI 모드
pnpm test:headed           # 브라우저 표시
pnpm test:debug            # 디버그 모드

# 기타
pnpm bddgen                # Step 파일 생성
pnpm test:report           # 리포트 확인
```

---

## 참고

- [테스트 아키텍처](./test-architecture.md) - Page Object, Component, 개발 원칙
- [Playwright-BDD](https://vitalets.github.io/playwright-bdd/)
- [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)
