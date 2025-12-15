# AstraGo Frontend

AstraGo 프론트엔드 애플리케이션입니다. 현대적인 웹 애플리케이션으로, 워크로드 관리, 대시보드, 모니터링, 관리자 기능을 제공하는 엔터프라이즈급 클라우드 네이티브 플랫폼입니다.


## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- pnpm

## 🧪 테스트

### 기본 테스트 명령어

```bash
# 전체 테스트 실행
pnpm test

# UI 모드로 테스트 실행
pnpm test:ui

# 헤드리스가 아닌 브라우저로 테스트 실행
pnpm test:headed

# 디버그 모드로 테스트 실행
pnpm test:debug
```

### 태그 기반 테스트

```bash
# Smoke 테스트 실행
pnpm test:smoke

# Regression 테스트 실행
pnpm test:regression

# 커스텀 태그로 테스트 실행 (grep 사용)
pnpm test:grep "@critical"
pnpm test:grep "@login"
pnpm test:grep "(?=.*@smoke)(?=.*@login)"  # 복수 태그 조합

# NOT 조건으로 테스트 제외
pnpm test:grep "(?!.*@skip)"
```

### 테스트 리포트

```bash
# Playwright HTML 리포트 보기
pnpm test:report

# Allure 리포트 생성 및 열기
pnpm test:allure

# Allure 리포트만 생성
pnpm test:allure:generate

# 생성된 Allure 리포트 열기
pnpm test:allure:open

```