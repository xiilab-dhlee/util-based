@workload-terminal
Feature: 워크로드 웹터미널 페이지 조회
  As a 사용자,
  I want to 워크로드 웹터미널 페이지에 접근했을 때
  So that 터미널을 사용하고 모니터링 이동 등의 기능을 사용할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 활성화 워크로드 목록 페이지에 있다
    When running 상태인 워크로드의 웹터미널 버튼을 클릭한다

  # ============================================
  # 웹터미널 페이지 조회
  # ============================================

  @smoke
  Scenario: 워크로드 웹터미널 페이지 조회
    Then 워크로드 웹터미널 페이지가 표시된다
    And URL이 "/user/workload/[id]/terminal?workspaceId="를 포함한다
