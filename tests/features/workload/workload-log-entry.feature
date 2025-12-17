@workload-log
Feature: 워크로드 로그 페이지 조회
  As a 사용자,
  I want to 워크로드 로그 페이지에 접근했을 때
  So that 로그를 확인할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 활성화 워크로드 목록 페이지에 있다

  # ============================================
  # 로그 페이지 조회
  # ============================================

  @smoke
  Scenario: 워크로드 로그 페이지 조회
    When running 상태인 워크로드의 로그 버튼을 클릭한다
    Then 워크로드 로그 페이지가 표시된다
    And URL이 "/user/workload/[id]/log?workspaceId="를 포함한다
    And 로그 영역에 하나 이상의 로그 라인이 존재한다
