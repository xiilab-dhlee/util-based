@auth @interaction
Feature: 회원가입
  As a 비로그인 사용자,
  I want to 회원가입 폼에서 입력값을 제출하면
  So that 유효성 검증을 거쳐 회원가입을 완료할 수 있다

  Background:
    Given 회원가입 페이지에 진입한다

  # ============================================
  # 필수값 미입력 검증
  # ============================================

  @smoke
  Scenario: Email 미입력 시 유효성 에러 표시
    Given Email을 제외한 필수값이 유효하게 입력되어 있다
      | field            | value       |
      | Password         | xiirocks1!  |
      | Confirm Password | xiirocks1!  |
      | First Name       | 길동        |
      | Last Name        | 홍          |
    When "회원가입" 버튼을 클릭한다
    Then Email 필드에 "이메일을 입력해 주세요." 에러 메시지가 표시된다
    And 회원가입 페이지에 유지된다

  @regression
  Scenario: Password 미입력 시 유효성 에러 표시
    Given Password를 제외한 필수값이 유효하게 입력되어 있다
      | field            | value            |
      | Email            | user1@xiilab.com |
      | Confirm Password | xiirocks1!       |
      | First Name       | 길동             |
      | Last Name        | 홍               |
    When "회원가입" 버튼을 클릭한다
    Then Password 필드에 "비밀번호를 입력해 주세요." 에러 메시지가 표시된다
    And 회원가입 페이지에 유지된다

  @regression
  Scenario: Confirm Password 미입력 시 유효성 에러 표시
    Given Confirm Password를 제외한 필수값이 유효하게 입력되어 있다
      | field      | value            |
      | Email      | user1@xiilab.com |
      | Password   | xiirocks1!       |
      | First Name | 길동             |
      | Last Name  | 홍               |
    When "회원가입" 버튼을 클릭한다
    Then Confirm Password 필드에 "비밀번호를 한 번 더 입력해 주세요." 에러 메시지가 표시된다
    And 회원가입 페이지에 유지된다

  @regression
  Scenario: First Name 미입력 시 유효성 에러 표시
    Given First Name을 제외한 필수값이 유효하게 입력되어 있다
      | field            | value            |
      | Email            | user1@xiilab.com |
      | Password         | xiirocks1!       |
      | Confirm Password | xiirocks1!       |
      | Last Name        | 홍               |
    When "회원가입" 버튼을 클릭한다
    Then First Name 필드에 "이름을 입력해 주세요." 에러 메시지가 표시된다
    And 회원가입 페이지에 유지된다

  @regression
  Scenario: Last Name 미입력 시 유효성 에러 표시
    Given Last Name을 제외한 필수값이 유효하게 입력되어 있다
      | field            | value            |
      | Email            | user1@xiilab.com |
      | Password         | xiirocks1!       |
      | Confirm Password | xiirocks1!       |
      | First Name       | 길동             |
    When "회원가입" 버튼을 클릭한다
    Then Last Name 필드에 "성을 입력해 주세요." 에러 메시지가 표시된다
    And 회원가입 페이지에 유지된다

  # ============================================
  # 형식 오류 검증
  # ============================================

  @regression
  Scenario: Email 형식 오류 시 유효성 에러 표시
    Given Email을 제외한 필수값이 유효하게 입력되어 있다
      | field            | value       |
      | Password         | xiirocks1!  |
      | Confirm Password | xiirocks1!  |
      | First Name       | 길동        |
      | Last Name        | 홍          |
    When Email 필드에 "user1@xiilab"을 입력한다
    And "회원가입" 버튼을 클릭한다
    Then Email 필드에 "올바른 이메일 형식을 입력해 주세요." 에러 메시지가 표시된다
    And 회원가입 페이지에 유지된다

  @regression
  Scenario: Password 정책 미충족 시 유효성 에러 표시
    Given Password를 제외한 필수값이 유효하게 입력되어 있다
      | field      | value            |
      | Email      | user1@xiilab.com |
      | First Name | 길동             |
      | Last Name  | 홍               |
    When Password 필드에 "password1"을 입력한다
    And Confirm Password 필드에 "password1"을 입력한다
    And "회원가입" 버튼을 클릭한다
    Then Password 필드에 "비밀번호는 영문, 숫자, 특수문자를 조합해 8~16자로 입력해 주세요." 에러 메시지가 표시된다
    And 회원가입 페이지에 유지된다

  @regression
  Scenario: Password 불일치 시 유효성 에러 표시
    Given Password를 제외한 필수값이 유효하게 입력되어 있다
      | field      | value            |
      | Email      | user1@xiilab.com |
      | First Name | 길동             |
      | Last Name  | 홍               |
    When Password 필드에 "xiirocks1!"을 입력한다
    And Confirm Password 필드에 "xiirocks2!"를 입력한다
    And "회원가입" 버튼을 클릭한다
    Then Confirm Password 필드에 "비밀번호가 일치하지 않습니다." 에러 메시지가 표시된다
    And 회원가입 페이지에 유지된다

  # ============================================
  # 성공 케이스
  # ============================================

  @smoke
  Scenario: 유효한 입력 시 회원가입 성공
    When Email 필드에 "user1@xiilab.com"을 입력한다
    And Password 필드에 "xiirocks1!"을 입력한다
    And Confirm Password 필드에 "xiirocks1!"을 입력한다
    And First Name 필드에 "길동"을 입력한다
    And Last Name 필드에 "홍"을 입력한다
    And "회원가입" 버튼을 클릭한다
    Then 회원가입이 성공적으로 처리된다
    And "로그인 페이지로 이동" 버튼이 표시된다
