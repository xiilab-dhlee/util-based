@workload-monitoring
Feature: 워크로드 모니터링 페이지 조회
  As a 사용자,
  I want to 워크로드 모니터링 페이지에 접근했을 때
  So that 모니터링 정보를 확인할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 활성화 워크로드 목록 페이지에 있다
    And running 또는 completed 상태인 워크로드의 모니터링 버튼을 클릭하여 모니터링 페이지로 이동한 상태다

  # ============================================
  # 모니터링 페이지 조회
  # ============================================

  @smoke
  Scenario: 워크로드 모니터링 페이지 조회
    Then 워크로드 모니터링 페이지가 표시된다
    And URL이 "/user/workload/[id]/monitoring?workspaceId="를 포함한다
    And CPU 사용량 차트가 표시된다
    And 메모리 사용량 차트가 표시된다
    And GPU 활용률 차트가 표시된다
    And GPU 메모리 차트가 표시된다
