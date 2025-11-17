# 테스트 가이드

이 디렉토리는 Playwright와 Cucumber를 사용한 BDD 테스트 코드를 포함합니다.

## 디렉토리 구조

```
tests/
├── features/              # Gherkin Feature 파일들
│   └── mig/              # MIG 관련 Feature 파일
├── step-definitions/      # Step Definitions (Given, When, Then)
│   └── mig/              # MIG 관련 Step Definitions
├── support/              # 테스트 지원 파일들
│   ├── world.ts         # Cucumber World 객체 (Playwright 통합)
│   ├── page-objects/    # Page Object Pattern 구현
│   └── helpers/         # 테스트 헬퍼 함수들
└── reports/             # 테스트 리포트 (gitignore됨)
```

## 실행 방법

### 전체 테스트 실행
```bash
pnpm test
```

### MIG 관련 테스트만 실행
```bash
pnpm test:mig
```

### UI 모드로 실행 (Playwright)
```bash
pnpm test:ui
```

### 디버그 모드
```bash
pnpm test:debug
```

### 리포트 보기
```bash
pnpm test:report
```

### Codegen (테스트 코드 자동 생성)
```bash
pnpm test:codegen
```

## 테스트 작성 가이드

### 1. Feature 파일 작성
`tests/features/` 디렉토리에 `.feature` 파일을 생성하고 Gherkin 문법으로 시나리오를 작성합니다.

### 2. Step Definitions 작성
`tests/step-definitions/` 디렉토리에 TypeScript 파일을 생성하고 각 Step을 구현합니다.

### 3. Page Object Pattern
재사용 가능한 페이지 객체는 `tests/support/page-objects/`에 작성합니다.

## 모킹

MSW(Mock Service Worker)를 사용하여 API를 모킹합니다. 
기본 핸들러는 `src/handlers/`에 정의되어 있으며, 
테스트에서 커스텀 모킹이 필요한 경우 `tests/support/helpers/msw-helper.ts`를 사용할 수 있습니다.

## 트레이싱

테스트 실패 시 자동으로 trace 파일이 생성됩니다. 
`pnpm test:trace <trace-file>` 명령으로 트레이스를 확인할 수 있습니다.

