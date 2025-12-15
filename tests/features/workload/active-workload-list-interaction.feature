@workload-list @interaction
Feature: 활성화 워크로드 목록 페이지 인터랙션
  As a 사용자,
  I want to 활성화 워크로드 목록에서 다양한 인터랙션을 수행하면
  So that 원하는 워크로드를 찾고 조회할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 활성화 워크로드 목록 페이지에 있다
    And 워크스페이스가 선택되어 있다

  # ============================================
  # 네비게이션
  # ============================================

  @regression
  Scenario: 워크로드 이름 클릭 시 상세 페이지로 이동
    Given 목록에 워크로드가 있다
    When 첫 번째 워크로드의 이름을 클릭하여 상세 페이지로 이동한다
    Then URL이 "/user/workload/[id]?workspaceId="를 포함한다
    And 워크로드 상세 페이지가 표시된다

  # ============================================
  # 로그/웹터미널/모니터링 페이지 이동
  # ============================================

  @regression
  Scenario: 워크로드 로그 페이지로 이동
    Given 목록에 상태가 "running"인 워크로드가 있다
    And 해당 워크로드의 로그 버튼이 활성화되어 있다
    When 해당 워크로드의 로그 버튼을 클릭하여 로그 페이지로 이동한다
    Then URL이 "/user/workload/[id]/log?workspaceId="를 포함한다
    And 워크로드 로그 페이지가 표시된다
    And 로그 영역에 하나 이상의 로그 라인이 존재한다

  @regression
  Scenario: 워크로드 웹터미널 페이지로 이동
    Given 목록에 상태가 "running"인 워크로드가 있다
    And 해당 워크로드의 웹터미널 버튼이 활성화되어 있다
    When 해당 워크로드의 웹터미널 버튼을 클릭하여 웹터미널 페이지로 이동한다
    Then URL이 "/user/workload/[id]/terminal?workspaceId="를 포함한다
    And 웹터미널에 xterm 터미널이 표시된다

  @regression
  Scenario: 워크로드 모니터링 페이지로 이동
    Given 목록에 상태가 "running"인 워크로드가 있다
    And 해당 워크로드의 모니터링 버튼이 활성화되어 있다
    When 해당 워크로드의 모니터링 버튼을 클릭하여 모니터링 페이지로 이동한다
    Then URL이 "/user/workload/[id]/monitoring?workspaceId="를 포함한다
    And 워크로드 모니터링 차트가 표시된다

  # ============================================
  # 필터링
  # ============================================

  @regression
  Scenario Outline: 워크로드 필터링 (<설명>)
    Given 목록에 워크로드가 있다
    When 필터 조건을 설정한다:
      | search   | jobType   | status   |
      | <search> | <jobType> | <status> |
    Then 필터 UI가 설정된 조건을 표시한다:
      | search   | jobType   | status   |
      | <search> | <jobType> | <status> |
    And 필터링된 목록이 조건에 맞게 표시된다:
      | search   | jobType   | status   |
      | <search> | <jobType> | <status> |

    # 핵심 조합만 테스트: 단일 필터, 복합 필터, 검색+필터
    Examples:
      | 설명                | search | jobType     | status |
      | 잡타입 단일 필터    | -      | Batch       | -      |
      | 상태 단일 필터      | -      | -           | 실행중 |
      | 잡타입+상태 복합    | -      | Interactive | 대기중 |
      | 검색+잡타입+상태    | auto   | Batch       | 실행중 |

  # ============================================
  # 액션 (종료)
  # ============================================

  @regression
  Scenario Outline: 워크로드 종료 <결과>
    Given 목록에 상태가 "running"인 워크로드가 있다
    And 해당 워크로드의 종료 버튼이 활성화되어 있다
    When 해당 워크로드의 종료 버튼을 클릭한다
    Then 확인 모달이 표시된다
    When 확인 모달의 <버튼> 버튼을 클릭한다
    Then 확인 모달이 닫힌다

    Examples:
      | 결과 | 버튼 |
      | 확인 | 확인 |
      | 취소 | 취소 |
