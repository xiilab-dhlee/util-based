Feature: 워크로드 검색
  사용자로서,
  워크로드 목록에서 특정 워크로드를 검색하여
  원하는 워크로드를 빠르게 찾고 싶다

  Background:
    Given 사용자가 워크로드 목록 페이지에 있다 

  @smoke
  Scenario: 워크로드 목록 페이지 접근
    Then 워크로드 목록 테이블이 표시된다
    Then 검색 입력창이 표시된다

  Scenario: 검색어로 워크로드 검색
    When 사용자가 검색창에 "test"를 입력한다
    When 사용자가 검색 폼을 제출한다
    Then 검색 결과가 표시된다

  @skip
  Scenario: 빈 검색어로 검색
    When 사용자가 검색창에 ""를 입력한다
    When 사용자가 검색 폼을 제출한다
    Then 모든 워크로드가 표시된다

  @skip
  Scenario: 존재하지 않는 워크로드 검색
    When 사용자가 검색창에 "nonexistent-workload-xyz-123"를 입력한다
    When 사용자가 검색 폼을 제출한다
    Then 검색 결과가 비어있을 수 있다

  @skip
  Scenario Outline: 다양한 검색어로 워크로드 검색
    When 사용자가 검색창에 "<검색어>"를 입력한다
    When 사용자가 검색 폼을 제출한다
    Then 검색이 실행된다

    Examples:
      | 검색어      |
      | pytorch     |
      | tensorflow  |
      | jupyter     |
      | notebook    |

  @skip
  @advanced
  Scenario: 검색 후 워크로드 이름 클릭하여 상세 페이지 이동
    When 사용자가 검색창에 "test"를 입력한다
    When 사용자가 검색 폼을 제출한다
    When 검색 결과에 워크로드가 있다면
    When 사용자가 첫 번째 워크로드 이름을 클릭한다
    Then 워크로드 상세 페이지로 이동한다
