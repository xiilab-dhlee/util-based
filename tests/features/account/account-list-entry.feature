@account-list @admin-only
Feature: 계정 관리 목록 페이지 진입
  As a 관리자,
  I want to 계정 관리 목록 페이지에 진입하면
  So that 등록된 계정 목록을 조회할 수 있다

  Background:
    Given 관리자가 로그인되어 있다

  @smoke
  Scenario: 계정 관리 목록 페이지 조회
    Given 계정 관리 목록 페이지에 있다
    Then 계정 관리 목록 페이지가 표시된다
    And 네비게이션 메뉴 중 "계정 관리" 메뉴가 선택되어 있다
    And 목록 페이지의 테이블이 표시된다
    And 목록 페이지의 총 개수가 표시된다
    And 목록 페이지의 페이지네이션이 표시된다
    And 목록 페이지의 검색창이 빈 값으로 표시된다
    And "계정 목록" 탭이 선택되어 있다

  # @regression @edge-case
  # Scenario: 계정 관리 목록 API 오류 시 에러 메시지 표시
  #   Given 계정 관리 목록 API가 500 에러를 반환하도록 설정한다
  #   When 계정 관리 목록 페이지로 이동한다
  #   Then 계정 관리 목록 페이지가 표시된다
  #   And 목록 페이지의 테이블이 표시된다
  #   And 목록 페이지의 테이블에 ERROR 메시지가 표시된다

  # @regression @edge-case
  # Scenario: 계정 관리 목록이 비어있을 때 빈 목록 메시지 표시
  #   Given 계정 관리 목록 API가 빈 목록을 반환하도록 설정한다
  #   When 계정 관리 목록 페이지로 이동한다
  #   Then 계정 관리 목록 페이지가 표시된다
  #   And 목록 페이지의 테이블이 표시된다
  #   And 목록 페이지의 총 개수가 0개로 표시된다
  #   And 목록 페이지의 테이블에 EMPTY 메시지가 표시된다
