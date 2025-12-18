@workload-list
Feature: 활성화 워크로드 목록 페이지 진입
  As a 사용자,
  I want to 활성화 워크로드 목록 페이지에 진입하면
  So that 실행 중인 워크로드 목록을 조회할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 활성화 워크로드 목록 페이지에 있다
    And 워크스페이스가 선택되어 있다

  @smoke
  Scenario: 활성화 워크로드 목록 페이지 조회
    Then 워크로드 목록 페이지가 표시된다
    And URL이 "/user/workload"와 일치한다
    And 워크로드 목록에 총 개수가 표시된다
    And 워크로드 목록 테이블이 표시된다
    And 워크로드 목록 페이지네이션이 표시된다
    And 잡 타입 필터가 빈 값으로 표시된다
    And 상태 필터가 빈 값으로 표시된다
    And 검색창이 빈 값으로 표시된다
    