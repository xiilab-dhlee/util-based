@workload-list @interaction
Feature: 활성화 워크로드 목록 페이지 인터랙션
  As a 사용자,
  I want to 활성화 워크로드 목록에서 다양한 인터랙션을 수행하면
  So that 원하는 워크로드를 찾고 조회할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 활성화 워크로드 목록 페이지에 있다

  @regression
  Scenario: 워크로드 상세 페이지로 이동
    When 첫 번째 워크로드의 이름을 클릭한다
    Then 워크로드 상세 페이지가 표시된다

  @regression
  Scenario: 워크로드 로그 페이지 이동
    When 실행중 또는 종료된 워크로드의 로그 버튼을 클릭한다
    Then 워크로드 로그 페이지가 표시된다

  @regression
  Scenario: 워크로드 웹터미널 페이지 이동
    When 실행중인 워크로드의 웹터미널 버튼을 클릭한다
    Then 워크로드 웹터미널 페이지가 표시된다

  @regression
  Scenario: 워크로드 모니터링 페이지 이동
    When 실행중 또는 종료된 워크로드의 모니터링 버튼을 클릭한다
    Then 워크로드 모니터링 페이지가 표시된다

  @regression
  Scenario Outline: 활성화 워크로드 검색 - <설명>
    When 목록 페이지의 검색창에 "<검색어>"를 입력한다
    Then 워크로드 검색 결과 검색어가 포함된 데이터만 표시된다

    Examples:
      | 설명            | 검색어           |
      | 일반 검색어     | auto             |
      | 한글 검색       | 테스트           |
      | 대문자 검색     | AUTO             |
      | 하이픈 포함     | test-workload    |
      | 언더스코어 포함 | test_workload_01 |
      | 숫자만          | 12345            |

  @regression
  Scenario Outline: 워크로드 잡타입 필터링 <설명>
    When 워크로드 필터를 설정한다:
      | jobType   | status   |
      | <jobType> | <status> |
    Then 워크로드 필터가 설정된 조건을 표시한다:
      | jobType   | status   |
      | <jobType> | <status> |
    And 필터링된 워크로드 목록이 조건에 맞게 표시된다:
      | jobType   | status   |
      | <jobType> | <status> |

    Examples:
      | 설명               | jobType     | status     |
      | 잡타입=Batch       | Batch       | -          |
      | 잡타입=Interactive | Interactive | -          |
      | 잡타입=Distributed | Distributed | -          |
      | 상태=실행중        | -          | 실행중    |
      | 상태=대기중        | -          | 대기중    |
      | 상태=에러         | -          | 에러     |

  @regression
  Scenario Outline: 워크로드 종료 <결과>
    When 첫 번째 워크로드의 종료 버튼을 클릭한다
    And "워크로드 종료" 모달의 <버튼> 버튼을 클릭한다
    Then "워크로드 종료" 모달이 닫힌다

    Examples:
      | 결과 | 버튼 |
      | 확인 | 확인 |
      | 취소 | 취소 |