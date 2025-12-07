# data-testid 레지스트리

E2E 테스트에서 사용하는 `data-testid` 셀렉터 중앙 관리 문서입니다.
새로운 `data-testid` 추가 시 반드시 이 문서에 등록하여 중복을 방지합니다.

---

## 사용 규칙

### 네이밍 컨벤션

```
{도메인}-{컴포넌트}-{역할}
{도메인}-{컴포넌트}-{id}
```

### 등록 절차

1. 새로운 `data-testid` 추가 전 이 문서에서 중복 확인
2. 사용할 셀렉터를 해당 도메인 섹션에 등록
3. 컴포넌트에 `data-testid` 속성 추가
4. Step 파일에서 해당 셀렉터 사용

---

## 공통 (shared)

모든 목록 페이지에서 공통으로 사용하는 셀렉터입니다.

| data-testid | 용도 | 컴포넌트 | 비고 |
|-------------|------|----------|------|
| `list-table` | 목록 테이블 래퍼 | ListWrapper | |
| `list-total-count` | 총 개수 표시 | - | |
| `list-pagination` | 페이지네이션 | - | |
| `list-search-input` | 검색 입력창 | - | |

---

## 워크로드 (workload)

### 페이지 헤더

| data-testid | 용도 | 컴포넌트 |
|-------------|------|----------|
| `user.workload` | 워크로드 목록 페이지 헤더 | PageHeader |
| `user.workload.detail` | 워크로드 상세 페이지 헤더 | PageHeader |

### 목록 테이블 데이터

| data-testid | 용도 | 컴포넌트 | 패턴 |
|-------------|------|----------|------|
| `workload-name-{id}` | 워크로드 이름 링크 | WorkloadNameLink | 동적 |
| `workload-job-type-{id}` | 잡 타입 텍스트 | create-workload-column | 동적 |
| `workload-elapsed-time-{id}` | 경과 시간 | create-workload-column | 동적 |
| `workload-status-{status}` | 상태 라벨 | WorkloadStatusText | 동적 |

**status 값:** `running`, `pending`, `completed`, `failed`

### 액션 버튼

| data-testid | 용도 | 컴포넌트 | 활성화 조건 |
|-------------|------|----------|------------|
| `workload-log-button` | 로그 버튼 | WorkloadLogButton | RUNNING, COMPLETED |
| `workload-terminal-button` | 웹터미널 버튼 | WorkloadTerminalButton | RUNNING |
| `workload-monitoring-button` | 모니터링 버튼 | WorkloadMonitoringButton | RUNNING, COMPLETED |
| `workload-connect-button` | 연결(포트) 버튼 | create-workload-column | RUNNING + 포트 설정 |
| `workload-stop-button` | 종료 버튼 | StopWorkloadButton | !COMPLETED |

### 필터

| data-testid | 용도 | 컴포넌트 |
|-------------|------|----------|
| `workload-filter-jobType` | 잡 타입 필터 | WorkloadJobTypeSort |
| `workload-filter-status` | 상태 필터 | WorkloadStatusSort |

---

## 사용자 모니터링 (user-monitoring)

### 페이지 헤더

| data-testid | 용도 | 컴포넌트 |
|-------------|------|----------|
| `user.monitoring` | 모니터링 페이지 헤더 | PageHeader |

### 위젯

| data-testid | 용도 | 컴포넌트 |
|-------------|------|----------|
| `user-monitoring-resource-graph` | CPU 리소스 그래프 | - |
| `user-monitoring-resource-recovery` | 리소스 회수 정보 | - |
| `user-monitoring-workload-status` | 워크로드 상태 정보 | - |
| `user-monitoring-resource-usage` | 사용 자원 정보 | - |
| `user-monitoring-running-workload-list` | 실행 중 워크로드 목록 | - |
| `user-monitoring-recovery-workload-list` | 리소스 회수 예정 목록 | - |

### 워크로드 상태 카운트

| data-testid | 용도 | 패턴 |
|-------------|------|------|
| `workload-status-all-count` | 전체 건수 | 정적 |
| `workload-status-running-count` | 실행중 건수 | 정적 |
| `workload-status-completed-count` | 완료 건수 | 정적 |
| `workload-status-pending-count` | 대기중 건수 | 정적 |
| `workload-status-failed-count` | 실패 건수 | 정적 |

---

## 워크스페이스 (workspace)

| data-testid | 용도 | 컴포넌트 |
|-------------|------|----------|
| `workspace-select-value` | 선택된 워크스페이스 값 | WorkspaceSelect |
| `workspace-select-placeholder` | 워크스페이스 미선택 placeholder | WorkspaceSelect |

---

## 중복 체크 방법

새로운 셀렉터 추가 전 아래 명령어로 기존 사용 여부를 확인합니다:

```bash
# 특정 셀렉터 검색
grep -r "data-testid=\"workload-" src/

# 모든 data-testid 목록 추출
grep -roh 'data-testid="[^"]*"' src/ | sort | uniq
```

---

## 변경 이력

| 날짜 | 변경 내용 | 작성자 |
|------|----------|--------|
| 2024-12-08 | 초기 문서 작성 | - |
