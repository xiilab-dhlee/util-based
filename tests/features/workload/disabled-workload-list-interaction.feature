@workload-list @interaction
Feature: 비활성화 워크로드 목록 페이지 인터랙션
  As a 사용자,
  I want to 비활성화 워크로드 목록에서 다양한 인터랙션을 수행하면
  So that 원하는 워크로드를 찾고 조회할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 비활성화 워크로드 목록 페이지에 있다
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
  # 탭 전환
  # ============================================

  @regression
  Scenario: 활성화 탭으로 이동
    When "활성화" 탭을 클릭하여 "활성화 워크로드 목록" 페이지로 이동한다
    Then URL이 "/user/workload"와 일치한다
    And "활성화" 탭이 선택되어 있다

  # ============================================
  # 로그/모니터링 조회
  # ============================================

  @regression
  Scenario: 워크로드 로그 조회
    Given 목록에 상태가 "completed"인 워크로드가 있다
    And 해당 워크로드의 로그 버튼이 활성화되어 있다
    When 해당 워크로드의 로그 버튼을 클릭하여 로그 페이지로 이동한다
    Then URL이 "/user/workload/[id]/log?workspaceId="를 포함한다
    And 로그 영역에 설정된 테마가 적용되어 있다
    And 로그 영역에 하나 이상의 로그 라인이 존재한다
    And 로그 모니터링 버튼이 표시된다
    And 로그 테마 변경 버튼이 표시된다

  @regression
  Scenario: 워크로드 모니터링 조회
    Given 목록에 상태가 "completed"인 워크로드가 있다
    And 해당 워크로드의 모니터링 버튼이 활성화되어 있다
    When 해당 워크로드의 모니터링 버튼을 클릭하여 모니터링 페이지로 이동한다
    Then URL이 "/user/workload/[id]/monitoring?workspaceId="를 포함한다
    And 워크로드 CPU 사용량 차트가 표시된다
    And 워크로드 Memory 사용량 차트가 표시된다
    And 워크로드 GPU 사용률 차트가 표시된다
    And 워크로드 GPU 메모리 차트가 표시된다

  # ============================================
  # 필터링
  # ============================================

  @regression
  Scenario Outline: 워크로드 필터링 (검색: <search>, 잡타입: <jobType>)
    Given 목록에 워크로드가 있다
    When 필터 조건을 설정한다:
      | search   | jobType   | status |
      | <search> | <jobType> | -      |
    Then 필터 UI가 설정된 조건을 표시한다:
      | search   | jobType   | status |
      | <search> | <jobType> | -      |

    Examples:
      | search | jobType     |
      | -      | Batch       |
      | -      | Interactive |
      | auto   | -           |
      | auto   | Batch       |
      | auto   | Interactive |

  # ============================================
  # 페이지네이션
  # ============================================

  @regression
  Scenario: 다음 페이지로 이동
    Given 목록에 워크로드가 있다
    And 총 페이지가 2 이상이다
    When 다음 페이지 버튼을 클릭한다
    Then 현재 페이지가 2이다

  @regression
  Scenario: 이전 페이지로 이동
    Given 목록에 워크로드가 있다
    And 총 페이지가 2 이상이다
    And 페이지 2로 이동한 상태이다
    When 이전 페이지 버튼을 클릭한다
    Then 현재 페이지가 1이다

  @regression
  Scenario: 특정 페이지 번호 클릭으로 이동
    Given 목록에 워크로드가 있다
    And 총 페이지가 3 이상이다
    When 페이지 3을 클릭한다
    Then 현재 페이지가 3이다

  # ============================================
  # 액션 (삭제, 재시작)
  # ============================================

  @regression
  Scenario Outline: 워크로드 삭제 <결과>
    Given 목록에 워크로드가 있다
    And 해당 워크로드의 삭제 버튼이 활성화되어 있다
    When 해당 워크로드의 삭제 버튼을 클릭한다
    Then 확인 모달이 표시된다
    When 확인 모달의 <버튼> 버튼을 클릭한다
    Then 확인 모달이 닫힌다

    Examples:
      | 결과 | 버튼 |
      | 확인 | 확인 |
      | 취소 | 취소 |

  @regression
  Scenario Outline: 워크로드 재시작 <결과>
    Given 목록에 워크로드가 있다
    And 해당 워크로드의 재시작 버튼이 활성화되어 있다
    When 해당 워크로드의 재시작 버튼을 클릭한다
    Then 확인 모달이 표시된다
    When 확인 모달의 <버튼> 버튼을 클릭한다
    Then 확인 모달이 닫힌다

    Examples:
      | 결과 | 버튼 |
      | 확인 | 확인 |
      | 취소 | 취소 |
