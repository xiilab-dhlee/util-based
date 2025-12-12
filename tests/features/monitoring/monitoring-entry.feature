Feature: 사용자 모니터링 페이지 진입
  As a 사용자,
  I want to 메인(모니터링) 페이지에 진입하면
  So that 선택된 워크스페이스 기준으로 모니터링 화면을 바로 조회할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 모니터링 페이지에 있다
    And 워크스페이스가 선택되어 있다

  @smoke
  Scenario: 모니터링 페이지 진입 및 기본 위젯 표시
    Then 모니터링 페이지가 표시된다
    And URL이 "/user/monitoring"와 일치한다
    And 네비게이션 메뉴 중 "모니터링" 메뉴가 활성화되어 있다
    And CPU 그래프가 표시된다
    And 리소스 회수 정보가 표시된다
    And 워크로드 정보가 표시된다
    And 사용 자원 정보가 표시된다
    And 실행 중 워크로드 목록이 표시된다
    And 리소스 회수 예정 워크로드 목록이 표시된다

  @smoke
  Scenario: 워크로드 정보 상세 검증
    Then 워크로드 상태별 건수가 표시된다
    And 상태별 건수의 합이 전체 건수와 일치한다
