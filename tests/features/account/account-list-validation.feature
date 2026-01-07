@account-list @validation @admin-only
Feature: 계정 관리 목록 검증
  As a 관리자,
  I want to 계정 목록의 데이터가 올바르게 표시되는지 확인하여
  So that 계정 정보를 정확하게 파악할 수 있다

  Background:
    Given 관리자가 로그인되어 있다
    And 계정 관리 목록 페이지에 있다

  @regression
  Scenario: 계정 목록 데이터 유효성 검증
    Then 각 계정의 이름이 빈 값이 아니다
    And 각 계정의 이메일이 빈 값이 아니다
    And 각 계정의 권한이 빈 값이 아니다
    And 각 계정의 가입일이 올바른 형식으로 표시된다
    And 각 계정의 권한이 다음 중 하나이다:
      | 권한    |
      | ADMIN   |
      | USER    |
      | SUPER_ADMIN |
