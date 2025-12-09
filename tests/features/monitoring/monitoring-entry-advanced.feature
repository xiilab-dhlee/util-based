Feature: 사용자 모니터링 페이지 진입 - 예외 케이스
  As a 사용자,
  I want to 비정상적인 상태에서 모니터링 페이지에 진입했을 때
  So that 적절한 안내를 받을 수 있다

  @skip @advanced
  Scenario: 로그인하지 않은 상태에서 모니터링 페이지 접근
    Given 사용자는 로그인하지 않은 상태이다
    When 사용자가 모니터링 페이지로 진입한다
    Then 로그인 페이지로 리다이렉트된다

  @skip @advanced
  Scenario: 워크스페이스가 선택되지 않은 상태에서 모니터링 페이지 접근
    Given 사용자는 로그인 상태이다
    When 사용자가 모니터링 페이지로 진입한다
    And 워크스페이스가 선택되어 있지 않다
    Then 워크스페이스 생성 모달이 나타난다.
