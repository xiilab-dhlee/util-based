@workload-detail
Feature: 워크로드 상세 페이지 조회
  As a 사용자,
  I want to 워크로드 목록에서 워크로드를 클릭했을 때
  So that 해당 워크로드의 상세 정보 페이지로 이동하여 상세 정보를 확인할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 워크로드 상세 페이지에 있다
    And 워크스페이스가 선택되어 있다

  # ============================================
  # 상세 페이지 진입 검증
  # ============================================

  @smoke
  Scenario: 워크로드 상세 페이지 진입
    Then 워크로드 상세 페이지가 표시된다
    And URL이 "/user/workload/[id]?workspaceId="를 포함한다
