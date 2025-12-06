# Gherkin E2E 테스트 컨벤션

Playwright-BDD를 사용한 E2E 테스트 작성 규칙입니다.

---

## 파일 구조

```
tests/
├── features/              # Feature 파일
│   ├── {도메인}/
│   │   ├── {기능}.feature           # 정상 케이스
│   │   └── {기능}-advanced.feature  # 예외 케이스
├── steps/                 # Step 정의
│   ├── common.steps.ts    # 공통 Step
│   └── {도메인}.steps.ts  # 도메인별 Step
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
인증 태그(`@authenticated-user`)를 사용하면 로그인 step을 생략할 수 있습니다.

```gherkin
Background:
  When 사용자가 모니터링 페이지로 진입한다
  And 워크스페이스가 선택되어 있다
```

### 파일 분리 기준

Background와 다른 전제 조건이 필요한 시나리오는 별도 파일로 분리합니다.

| 파일 | 용도 |
|------|------|
| `{기능}.feature` | 정상 케이스 (Background 포함) |
| `{기능}-advanced.feature` | 예외 케이스 (Background 없음) |

---

## 태그 목록

### 유스케이스 ID 태그

Feature 레벨에 유스케이스 ID를 태그로 명시합니다. 이를 통해 특정 유스케이스만 선택적으로 실행할 수 있습니다.

```gherkin
@TESTUC-5
Feature: 사용자 모니터링 페이지 진입
  As a 사용자,
  ...
```

**실행 방법:**
```bash
pnpm test:uc @TESTUC-5    # 특정 유스케이스만 실행
```

### 인증 태그

Feature 레벨에 인증 태그를 추가하면 Before Hook에서 자동으로 로그인을 수행합니다.
Background에서 로그인 step을 생략할 수 있어 코드가 간결해집니다.

```gherkin
@TESTUC-5 @authenticated-user
Feature: 사용자 모니터링 페이지 진입

  Background:
    When 사용자가 모니터링 페이지로 진입한다
    And 워크스페이스가 선택되어 있다
```

| 태그 | 로그인 사용자 | 용도 |
|------|-------------|------|
| `@authenticated` | admin | 관리자 페이지 테스트 |
| `@authenticated-user` | user | 일반 사용자 페이지 테스트 |

### 기본 태그

| 태그 | 용도 | 실행 여부 |
|------|------|----------|
| `@TESTUC-{N}` | 유스케이스 ID | 실행됨 |
| `@smoke` | 핵심 기능 검증 | 실행됨 |
| `@skip` | 미구현/비활성화 | 스킵됨 |
| `@advanced` | 예외/엣지 케이스 | 실행됨 |
| `@skip @advanced` | 향후 구현 예정 | 스킵됨 |

---

## 공통 Step 목록

`tests/steps/common.steps.ts`에 정의된 Step입니다. 새 Feature 작성 시 이 Step들을 우선 사용합니다.

### 인증 관련

| Step | 용도 |
|------|------|
| `Given 사용자는 로그인 상태이다` | 일반 사용자(user)로 로그인 |
| `Given 사용자는 로그인하지 않은 상태이다` | 로그아웃 상태 설정 |
| `Then 로그인 페이지로 리다이렉트된다` | 로그인 리다이렉트 확인 |

### 워크스페이스 관련

| Step | 용도 |
|------|------|
| `Given/And 워크스페이스가 선택되어 있다` | 워크스페이스 선택 상태 확인 |
| `Given/And 워크스페이스가 선택되어 있지 않다` | 워크스페이스 미선택 상태 확인 |
| `Then 워크스페이스 선택 안내가 표시된다` | 워크스페이스 안내 UI 확인 |

### URL 관련

| Step | 용도 |
|------|------|
| `Then URL이 "{path}"이다` | URL 검증 |

---

## data-testid 규칙

### PageHeader

PageHeader 컴포넌트는 `pageKey`를 그대로 `data-testid`로 사용합니다.

```tsx
<PageHeader pageKey="user.monitoring" />
// -> data-testid="user.monitoring"
```

### 기타 컴포넌트

`{도메인}-{컴포넌트}-{역할}` 형식을 사용합니다.

| 예시 | 설명 |
|------|------|
| `user-monitoring-resource-graph` | 모니터링 리소스 그래프 |
| `workspace-select-value` | 워크스페이스 선택 값 |
| `workspace-select-placeholder` | 워크스페이스 미선택 placeholder |

---

## 차트 컴포넌트 테스트

ApexCharts를 사용하는 차트 컴포넌트는 **컨테이너 visibility + canvas 렌더링 완료**를 함께 확인합니다.

### 검증 방법

```typescript
// 1. 컨테이너 존재 확인
const container = page.locator('[data-testid="user-monitoring-resource-graph"]');
await expect(container).toBeVisible({ timeout: 10000 });

// 2. ApexCharts 렌더링 완료 확인
const chart = container.locator(".apexcharts-canvas");
await expect(chart).toBeVisible({ timeout: 10000 });
```

### 사용 가이드

| 차트 타입 | 셀렉터 | 비고 |
|----------|--------|------|
| Area/Line/Bar | `.apexcharts-canvas` | 일반 차트 |
| RadialBar | `.apexcharts-canvas` | 원형 게이지 |

---

## 테이블 컴포넌트 테스트

Ant Design Table(CustomizedTable)을 사용하는 테이블 컴포넌트는 상황에 따라 두 가지 검증 방법을 사용합니다.

### 기본 검증 (테이블 구조 확인)

테이블 본체가 렌더링되었는지 확인합니다. mock 데이터나 정적 데이터 사용 시 권장됩니다.

```typescript
const container = page.locator('[data-testid="user-monitoring-running-workload-list"]');
await expect(container).toBeVisible({ timeout: 10000 });

// 테이블 본체 렌더링 확인
const tableBody = container.locator(".ant-table-tbody");
await expect(tableBody).toBeVisible({ timeout: 10000 });
```

### 엄격 검증 (데이터 행 존재 확인)

실제 데이터 행이 존재하는지 확인합니다. API 연동 후 데이터가 정상적으로 로드되었는지 검증할 때 사용합니다.

```typescript
// 데이터 행이 최소 1개 이상 존재하는지 확인
const rows = container.locator(".ant-table-tbody tr.ant-table-row");
await expect(rows.first()).toBeVisible({ timeout: 10000 });
```

### 사용 가이드

| 검증 방법 | 셀렉터 | 사용 시점 |
|----------|--------|----------|
| 기본 | `.ant-table-tbody` | mock/정적 데이터, 테이블 렌더링 확인 |
| 엄격 | `.ant-table-tbody tr.ant-table-row` | API 연동 후, 데이터 로드 확인 |

---

## 테스트 실행

```bash
pnpm test:monitoring       # 모니터링 테스트
pnpm test:smoke            # Smoke 테스트만
pnpm test:uc @TESTUC-5     # 특정 유스케이스만 실행
pnpm test:ui               # UI 모드
pnpm bddgen                # Step 파일 생성
```

---

## 참고

- [Playwright-BDD](https://vitalets.github.io/playwright-bdd/)
- [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)
