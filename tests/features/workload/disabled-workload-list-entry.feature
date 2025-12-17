@workload-list
Feature: 비활성화 워크로드 목록 페이지 진입
  As a 사용자,
  I want to 비활성화 워크로드 목록 페이지에 진입하면
  So that 종료된 워크로드 목록을 조회할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    When 비활성화 워크로드 목록 페이지로 이동한다

  @smoke
  Scenario: 비활성화 워크로드 목록 페이지 진입
    Then 워크로드 목록 페이지가 표시된다
    And URL이 "/user/workload/disabled"와 일치한다
    And 목록 테이블이 표시된다
