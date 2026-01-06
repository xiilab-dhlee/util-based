@hub
Feature: 허브 페이지 진입
  As a 사용자,
  I want to 허브 페이지에 진입하면
  So that 허브 목록과 선택된 허브의 상세 정보를 동시에 확인할 수 있다

  Background:
    Given 사용자가 로그인되어 있다

  @smoke
  Scenario: 허브 페이지 조회
    Given 허브 페이지에 있다
    Then 허브 페이지가 표시된다
    And 네비게이션 메뉴 중 "허브" 메뉴가 선택되어 있다
    And 목록 페이지의 그리드가 표시된다
    And 허브 목록에 1개 이상의 데이터가 있다
    And 첫 번째 허브 카드가 선택된 상태이다
    And 허브 상세 이름이 표시된다
    And 허브 README 콘텐츠가 표시된다

  @regression
  Scenario: URL로 특정 허브 상세 페이지 직접 접근
    When ID가 "1"이고 이름이 "HUB-1"인 허브 페이지로 이동한다
    Then 허브 페이지가 표시된다
    And 허브 상세 이름이 표시된다
    And 허브 README 콘텐츠가 표시된다