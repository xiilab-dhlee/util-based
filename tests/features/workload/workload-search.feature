Feature: 워크로드 목록 검색
  As a 사용자
  I want to 워크로드 목록에서 검색할 수 있어야 한다
  So that 원하는 워크로드를 빠르게 찾을 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 브라우저가 초기화되어 있다
    And MSW 서버가 시작되어 있다
    And 워크로드 목록 페이지에 접근한다

  Scenario: 워크로드 이름으로 검색
    Given 워크로드 목록이 표시되어 있다
    When 사용자가 검색어 입력 필드에 "test-workload"를 입력한다
    And 사용자가 검색 버튼을 클릭한다
    Then 검색 결과가 표시된다
    And 검색 결과에 "test-workload"가 포함된 워크로드만 표시된다

  Scenario: 검색어 초기화
    Given 사용자가 "test-workload"로 검색한 상태이다
    When 사용자가 검색어 입력 필드를 비운다
    And 사용자가 검색 버튼을 클릭한다
    Then 전체 워크로드 목록이 표시된다

  Scenario: 빈 검색어로 검색
    Given 워크로드 목록이 표시되어 있다
    When 사용자가 검색어 입력 필드에 빈 값을 입력한다
    And 사용자가 검색 버튼을 클릭한다
    Then 전체 워크로드 목록이 표시된다

  Scenario: 검색 결과 없음
    Given 워크로드 목록이 표시되어 있다
    When 사용자가 검색어 입력 필드에 "존재하지않는워크로드"를 입력한다
    And 사용자가 검색 버튼을 클릭한다
    Then "검색 결과가 없습니다" 메시지가 표시된다

  Scenario: 검색어와 필터 조합
    Given 워크로드 목록이 표시되어 있다
    When 사용자가 작업 유형을 "INTERACTIVE"로 선택한다
    And 사용자가 검색어 입력 필드에 "test"를 입력한다
    And 사용자가 검색 버튼을 클릭한다
    Then 검색 결과가 표시된다
    And 검색 결과의 모든 워크로드가 "INTERACTIVE" 작업 유형이다
    And 검색 결과의 모든 워크로드 이름에 "test"가 포함되어 있다

  Scenario Outline: 다양한 검색어로 검색
    Given 워크로드 목록이 표시되어 있다
    When 사용자가 검색어 입력 필드에 "<search_term>"를 입력한다
    And 사용자가 검색 버튼을 클릭한다
    Then 검색 결과가 표시된다
    And 검색 결과 개수가 "<expected_count>"개 이상이다

    Examples:
      | search_term    | expected_count |
      | test           | 1              |
      | workload       | 1              |
      | batch          | 0              |
      | interactive    | 0              |

