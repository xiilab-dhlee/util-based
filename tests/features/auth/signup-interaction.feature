@auth @interaction
Feature: 회원가입 인터랙션
  As a 비로그인 사용자,
  I want to 회원가입 폼에서 입력값을 제출하면
  So that 회원가입을 완료하고 로그인 페이지로 이동할 수 있다

  Background:
    Given 회원가입 페이지에 진입한다

  # ============================================
  # maxLength 제한 검증 (입력 인터랙션)
  # ============================================

  @regression
  Scenario: First Name 필드는 25자까지만 입력 가능하다
    When First Name 필드에 26자를 입력하려고 시도한다
    Then First Name 필드에는 25자까지만 입력되어 있다

  @regression
  Scenario: Last Name 필드는 25자까지만 입력 가능하다
    When Last Name 필드에 26자를 입력하려고 시도한다
    Then Last Name 필드에는 25자까지만 입력되어 있다

  # ============================================
  # 회원가입 성공 케이스
  # ============================================

  @smoke
  Scenario: 유효한 입력 시 회원가입 성공
    When Email 필드에 "user1@xiilab.com"을 입력한다
    And Password 필드에 "xiirocks1!"을 입력한다
    And Confirm Password 필드에 "xiirocks1!"을 입력한다
    And First Name 필드에 "길동"을 입력한다
    And Last Name 필드에 "홍"을 입력한다
    And 회원가입 버튼을 클릭한다
    Then 회원가입이 성공적으로 처리된다
    And 로그인 페이지로 이동 버튼이 표시된다
