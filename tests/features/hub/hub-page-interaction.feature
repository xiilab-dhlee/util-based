@hub @interaction
Feature: 허브 페이지 인터랙션
  As a 사용자,
  I want to 허브 페이지에서 다양한 인터랙션을 수행하면
  So that 원하는 허브를 선택하고 워크로드를 생성할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 허브 페이지에 있다

  @regression 
  Scenario: 다른 허브 카드 클릭 시 상세 정보 변경
    Given 허브 목록에 2개 이상의 데이터가 있다
    When 두 번째 허브 카드를 클릭한다
    Then 허브 상세 이름이 변경된다
    And 두 번째 허브 카드가 선택된 상태이다
    And 허브 README 콘텐츠가 표시된다

  @regression
  Scenario: 워크로드 생성 버튼 클릭
    When 허브에서 워크로드 생성 버튼을 클릭한다
    Then 워크로드 생성 드로어가 표시된다

  @regression
  Scenario Outline: 허브 검색 - <설명>
    When 목록 페이지의 검색창에 "<검색어>"를 입력한다
    Then 허브 검색 결과 검색어가 포함된 데이터만 표시된다

    Examples:
      | 설명           | 검색어     |
      | 일반 검색어    | HUB        |
      | 한글 검색      | 테스트     |
      | 대문자 검색    | YOLO       |
      | 소문자 검색    | yolo       |
