@auth @validation
Feature: 회원가입 유효성 검증
  As a 비로그인 사용자,
  I want to 회원가입 폼에서 유효하지 않은 값을 입력하면
  So that 적절한 에러 메시지를 확인하고 올바른 값을 입력할 수 있다

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
    When 회원가입 버튼을 클릭한다
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
    When 회원가입 버튼을 클릭한다
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
    When 회원가입 버튼을 클릭한다
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
    When 회원가입 버튼을 클릭한다
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
    When 회원가입 버튼을 클릭한다
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
    And 회원가입 버튼을 클릭한다
    Then Email 필드에 "올바른 이메일 형식을 입력해 주세요." 에러 메시지가 표시된다
    And 회원가입 페이지에 유지된다

  # --------------------------------------------
  # Password 정책 실패 케이스 (1가지만 사용)
  # --------------------------------------------

  @regression
  Scenario Outline: Password 정책 미충족 - <case>
    Given Password를 제외한 필수값이 유효하게 입력되어 있다
      | field      | value            |
      | Email      | user1@xiilab.com |
      | First Name | 길동             |
      | Last Name  | 홍               |
    When Password 필드에 "<password>"을 입력한다
    And Confirm Password 필드에 "<password>"을 입력한다
    And 회원가입 버튼을 클릭한다
    Then Password 필드에 "영문 대소문자, 숫자, 특수문자 중 2가지 이상, 8~16자 이내로 입력해 주세요." 에러 메시지가 표시된다
    And 회원가입 페이지에 유지된다

    Examples:
      | case               | password          |
      | 영문만 사용        | aaaaaaaa          |
      | 숫자만 사용        | 12345678          |
      | 특수문자만 사용    | !@#$%^&*          |
      | 7자 미만           | pass1!            |
      | 17자 초과          | password12345!@#$ |

  @regression
  Scenario: Password 불일치 시 유효성 에러 표시
    Given Password를 제외한 필수값이 유효하게 입력되어 있다
      | field      | value            |
      | Email      | user1@xiilab.com |
      | First Name | 길동             |
      | Last Name  | 홍               |
    When Password 필드에 "xiirocks1!"을 입력한다
    And Confirm Password 필드에 "xiirocks2!"을 입력한다
    And 회원가입 버튼을 클릭한다
    Then Confirm Password 필드에 "비밀번호가 일치하지 않습니다." 에러 메시지가 표시된다
    And 회원가입 페이지에 유지된다
