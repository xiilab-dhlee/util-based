@account-pending @validation @admin-only
Feature: 가입 승인 목록 검증
  As a 관리자,
  I want to 가입 승인 목록의 데이터가 올바르게 표시되는지 확인하여
  So that 가입 신청 정보를 정확하게 파악할 수 있다

  Background:
    Given 가입 승인 목록 페이지에 있다

  @regression
  Scenario: 가입 승인 목록 데이터 유효성 검증
    Then 각 가입 신청의 이름이 빈 값이 아니다
    And 각 가입 신청의 이메일이 빈 값이 아니다
    And 각 가입 신청의 가입일이 올바른 형식으로 표시된다
