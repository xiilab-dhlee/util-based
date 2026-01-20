@signup
Feature: 회원가입 페이지 진입
  As a 비로그인 사용자,
  I want to 회원가입 페이지에 진입하면
  So that 회원가입 폼을 확인하고 입력을 시작할 수 있다

  Background:
    Given 회원가입 페이지에 진입한다

  @smoke
  Scenario: 회원가입 페이지 조회
    Then 회원가입 페이지가 표시된다
    And Email 입력창이 빈 값이다
    And Password 입력창이 빈 값이다
    And Confirm Password 입력창이 빈 값이다
    And First Name 입력창이 빈 값이다
    And Last Name 입력창이 빈 값이다
    And Group Name 선택값이 비어있다
    And 회원가입 버튼이 표시된다
    And 로그인하기 링크가 표시된다
