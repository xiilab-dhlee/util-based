@workload-list @validation
Feature: 활성화 워크로드 목록 검증
  As a 사용자,
  I want to 워크로드 상태에 따라 제어 버튼이 올바르게 활성화/비활성화되는지 확인하여
  So that 현재 상태에서 사용 가능한 기능을 명확히 알 수 있다

  Background:
    Given 활성화 워크로드 목록 페이지에 있다

  @regression
  Scenario: 활성화 워크로드 목록 데이터 유효성 검증
    Then 각 워크로드의 이름이 빈 값이 아니다
    And 각 워크로드의 잡 타입이 다음 중 하나이다:
      | 잡 타입       |
      | batch        |
      | interactive  |
      | distributed  |
    And 각 워크로드의 생성자가 빈 값이 아니다
    And 각 워크로드의 경과 시간이 올바른 형식으로 표시된다
    And 각 워크로드의 상태가 다음 중 하나로 표시된다:
      | 상태    |
      | pending |
      | running |
      | failed  |

  @regression
  Scenario Outline: 워크로드 제어 버튼 상태 검증 (<상태명>)
    When 목록에 상태가 "<상태명>"인 워크로드를 바라본다
    Then 해당 워크로드의 로그 버튼 상태가 <로그>이다
    And 해당 워크로드의 웹터미널 버튼 상태가 <웹터미널>이다
    And 해당 워크로드의 모니터링 버튼 상태가 <모니터링>이다
    And 해당 워크로드의 종료 버튼 상태가 <종료>이다

    Examples:
      | 상태명  | 로그     | 웹터미널 | 모니터링 | 종료   |
      | running | 활성화  | 활성화  | 활성화   | 활성화 |
      | pending | 비활성화 | 비활성화 | 비활성화 | 활성화 |
      | failed  | 비활성화 | 비활성화 | 비활성화 | 활성화 |