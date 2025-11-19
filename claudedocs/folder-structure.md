## Astrago Frontend 폴더 구조 (Domain + Layered)

```text
src/
  app/       # Next.js 라우트 & 페이지 엔트리
  shared/    # 도메인 독립 공통 UI/훅/유틸
  domain/    # 도메인(업무) 모듈
  styles/    # 전역 스타일/테마
  mocks/     # MSW 등 목킹
```

### `app/`
- **역할**: URL 구조, 페이지 엔트리, 레이아웃 구성
- **원칙**: 비즈니스 로직은 `domain/`으로 내려보내고, 라우트 파일은 최대한 얇게 유지

### `shared/`
```text
src/shared/
  components/  # 도메인 이름이 안 들어가는 공통 UI
  hooks/       # 도메인 독립 공통 훅
  api/         # 여러 도메인에서 쓰는 유틸성 API
  constants/   # 도메인과 무관한 공통 상수
  utils/       # 도메인 독립 앱 레벨 유틸
```
- **역할**: 여러 도메인에서 재사용되는 공통 레이어
- **원칙**: 파일/이름에 도메인 용어(Workload, Volume 등) 금지

### `domain/` (도메인 모듈 예시)
```text
src/domain/workload/
  api/         # workload.service.ts, aggregated service 등
  components/  # list/, detail/, modals/ 등 도메인 UI
  hooks/       # use-get-workloads, use-create-workload 등
  state/       # 페이지/기능 레벨 Context, 필요 시 도메인 jotai
  constants/   # workload.key, workload.error, *_list.constant 등
  types/       # workload.model, workload.interface
  schemas/     # workload-form.schema (Zod)
  pages/       # WorkloadPage 등 라우트용 조립 컴포넌트
  index.ts     # 이 도메인의 public export 모음
```
- **역할**: 한 도메인의 UI/로직/타입/상수를 한 곳에 응집
- **원칙**: 도메인 이름이 들어가면 무조건 `domain/{domain}` 안으로

### 의존성 방향
```text
app/  →  domain/*  →  shared/*
```
- 상위 계층이 아래 계층만 바라보는 단방향 구조를 유지한다.


