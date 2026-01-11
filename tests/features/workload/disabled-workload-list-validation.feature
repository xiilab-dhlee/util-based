@workload-list @validation
Feature: 비활성화 워크로드 목록 검증
  As a 사용자,
  I want to 비활성화 워크로드 목록에서 데이터가 올바르게 표시되는지 확인하여
  So that 비활성화 워크로드 데이터 검증을 할 수 있다

  Background:
    Given 비활성화 워크로드 목록 페이지에 있다

  @regression
  Scenario: 비활성화 워크로드 목록 데이터 유효성 검증
    Then 각 워크로드의 이름이 빈 값이 아니다
    And 각 워크로드의 잡 타입이 다음 중 하나이다:
      | 잡 타입       |
      | batch         |
      | interactive   |
      | distributed   |
    And 각 워크로드의 경과 시간이 올바른 형식으로 표시된다
    And 각 워크로드의 상태가 다음 중 하나로 표시된다:
      | 상태    |
      | completed |
