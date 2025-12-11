@authenticated-user
Feature: 워크로드 상세 페이지 조회
  As a 사용자,
  I want to 워크로드 목록에서 워크로드를 클릭했을 때
  So that 해당 워크로드의 상세 정보 페이지로 이동하여 기본 정보, 이벤트 이력, 상세 정보를 확인할 수 있다

  Background:
    When 사용자가 워크로드 상세 페이지로 진입한다
    And 워크스페이스가 선택되어 있다

  # ============================================
  # 상세 페이지 진입 및 기본 UI 검증
  # ============================================

  @smoke @TESTUC-9
  Scenario: 워크로드 상세 페이지 진입 시 기본 UI 표시
    Then 워크로드 상세 페이지가 표시된다
    And URL이 "/user/workload/[id]?workspaceId="를 포함한다
    And 네비게이션 메뉴 중 "워크로드" 메뉴가 활성화되어 있다
    And "상세정보" 탭이 선택되어 있다

  # ============================================
  # 워크로드 기본 정보 확인
  # ============================================

  @smoke @TESTUC-9
  Scenario: 기본 정보 표시
    Then 워크로드 이름이 표시된다
    And 워크로드 상태가 다음 중 하나로 표시된다:
      | 상태      |
      | running   |
      | pending   |
      | completed |
      | failed    |
    And 워크로드 설명이 표시된다
    And 워크로드 수정 버튼이 표시된다
    And Job Type 정보가 표시된다
    And 노드 타입 정보가 표시된다
    And 이미지 정보가 표시된다
    And Commit Image 생성 버튼이 표시된다
    And 보안검사 결과가 표시된다
    And 실행 경로, 실행 명령어 정보가 표시된다
    And 환경변수 정보가 표시된다
    And 포트 정보가 표시된다
    And 생성자가 표시된다
    And 생성일이 yyyy.MM.dd 형식으로 표시된다
    And 선택한 GPU 정보가 표시된다
    And 리소스 정보가 표시된다

  @regression @TESTUC-9
  Scenario: 워크로드 이벤트 이력 데이터 유효성 검증
    Then 각 이벤트 이름이 표시된다
    And 각 이벤트 상태가 다음 중 하나이다:
      | 상태     |
      | Normal   |
      | Warning  |
    And 각 이벤트 경과 시간이 yyyy.MM.dd HH:mm:ss 형식으로 표시된다
    And 각 이벤트 From이 표시된다
    And 각 이벤트 메시지가 표시된다

  @regression @TESTUC-9
  Scenario: 워크로드 소스코드 데이터 유효성 검증
    Then 각 소스코드 이름이 표시된다
    And 각 소스코드 상태가 다음 중 하나이다:
      | 상태     |
      | public   |
      | private  |
    And 각 소스코드 경로가 표시된다
    And 각 소스코드 Git URL이 표시된다
    And 각 소스코드 타입이 다음 중 하나이다:
      | 타입     |
      | GitHub   |
      | GitLab   |
      | BitBucket|

  # ============================================
  # 상태별 동작 검증
  # ============================================

  @regression @TESTUC-9
  Scenario: 워크로드 상태가 대기중일 때 UI 표시
    Given 워크로드 상태가 "대기중"이다
    Then 워크로드 종료 버튼이 표시된다
    And "로그" 탭이 비활성화되어 있다
    And "웹터미널" 탭이 비활성화되어 있다
    And "모니터링" 탭이 비활성화되어 있다
    And "파일목록" 탭이 비활성화되어 있다
    
  @regression @TESTUC-9
  Scenario: 워크로드 상태가 실행중일 때 UI 표시
    Given 워크로드 상태가 "실행중"이다
    Then 워크로드 종료 버튼이 표시된다

  @regression @TESTUC-9
  Scenario: 워크로드 상태가 종료되었을 때 UI 표시
    Given 워크로드 상태가 "종료"이다
    Then 워크로드 재시작 버튼이 표시된다
    And 워크로드 삭제 버튼이 표시된다
    And "파일 목록" 탭이 비활성화되어 있다
