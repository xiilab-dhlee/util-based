@workload-list @interaction
Feature: 활성화 워크로드 목록 페이지 인터랙션
  As a 사용자,
  I want to 활성화 워크로드 목록에서 다양한 인터랙션을 수행하면
  So that 원하는 워크로드를 찾고 조회할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 활성화 워크로드 목록 페이지에 있다

  # ============================================
  # 네비게이션
  # ============================================

  @regression
  Scenario: 워크로드 상세 페이지로 이동
    When 첫 번째 워크로드의 이름을 클릭한다
    Then 워크로드 상세 페이지가 표시된다
    And URL이 "/user/workload/[id]?workspaceId="를 포함한다
    

  # ============================================
  # 로그/웹터미널/모니터링 페이지 이동
  # ============================================

  @regression
  Scenario: 워크로드 로그 페이지 이동
    When running 상태인 워크로드의 로그 버튼을 클릭한다
    Then 워크로드 로그 페이지가 표시된다
    And URL이 "/user/workload/[id]/log?workspaceId="를 포함한다

  @regression
  Scenario: 워크로드 웹터미널 페이지 이동
    When running 상태인 워크로드의 웹터미널 버튼을 클릭한다
    Then 워크로드 웹터미널 페이지가 표시된다
    And URL이 "/user/workload/[id]/terminal?workspaceId="를 포함한다

  @regression
  Scenario: 워크로드 모니터링 페이지 이동
    When running 상태인 워크로드의 모니터링 버튼을 클릭한다
    Then 워크로드 모니터링 페이지가 표시된다
    And URL이 "/user/workload/[id]/monitoring?workspaceId="를 포함한다

  # ============================================
  # 필터링
  # ============================================

  @regression
  Scenario Outline: 워크로드 탐색 <설명>
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
    When running 상태인 워크로드의 종료 버튼을 클릭한다
    And 확인 모달의 <버튼> 버튼을 클릭한다
    Then 확인 모달이 닫힌다

    Examples:
      | 결과 | 버튼 |
      | 확인 | 확인 |
      | 취소 | 취소 |
