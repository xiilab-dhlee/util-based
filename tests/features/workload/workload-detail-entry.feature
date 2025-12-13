@workload-detail
Feature: 워크로드 상세 페이지 조회
  As a 사용자,
  I want to 워크로드 목록에서 워크로드를 클릭했을 때
  So that 해당 워크로드의 상세 정보 페이지로 이동하여 기본 정보, 이벤트 이력, 상세 정보를 확인할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 워크로드 상세 페이지에 있다
    And 워크스페이스가 선택되어 있다

  # ============================================
  # 상세 페이지 진입 및 기본 UI 검증
  # ============================================

  @smoke
  Scenario: 워크로드 상세 페이지 진입 시 기본 UI 표시
    Then 워크로드 상세 페이지가 표시된다
    And URL이 "/user/workload/[id]?workspaceId="를 포함한다
    And 네비게이션 메뉴 중 "워크로드" 메뉴가 활성화되어 있다
    And "상세정보" 탭이 선택되어 있다

  # ============================================
  # 워크로드 기본 정보 확인
  # ============================================

  @smoke
  Scenario: 워크로드 기본 정보 표시
    Then 워크로드 이름이 표시된다
    And 워크로드 상태가 다음 중 하나로 표시된다:
      | 상태      |
      | running   |
      | pending   |
      | completed |
      | failed    |
    And 워크로드 설명이 표시된다
    And 워크로드 수정 버튼이 표시된다

  @smoke
  Scenario: Job 설정 정보 표시
    Then Job Type 정보가 표시된다
    And 노드 타입 정보가 표시된다
    And 이미지 정보가 표시된다
    And Commit Image 생성 버튼이 표시된다
    And 보안검사 결과가 표시된다

  @smoke
  Scenario: 실행 설정 정보 표시
    Then 실행 경로, 실행 명령어 정보가 표시된다
    And 환경변수 정보가 표시된다
    And 포트 정보가 표시된다

  @smoke
  Scenario: 메타 및 리소스 정보 표시
    Then 생성자가 표시된다
    And 생성일이 yyyy.MM.dd 형식으로 표시된다
    And 선택한 GPU 정보가 표시된다
    And 리소스 정보가 표시된다
