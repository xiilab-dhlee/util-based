@credential @validation
Feature: Docker 타입 크리덴셜 유효성 검증
  As a 로그인한 사용자,
  I want to Docker 크리덴셜 추가 폼에서 유효하지 않은 값을 입력하면
  So that 적절한 에러 메시지를 확인하고 올바른 값을 입력할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 사용자 설정 페이지에 있다
    And 크리덴셜 추가 모달이 열린 상태이다
    And 크리덴셜 타입을 "Docker"로 선택한다

  # ============================================
  # 이름 필드 유효성 검증
  # ============================================

  @smoke
  Scenario: 이름 미입력 시 유효성 에러 표시
    Given 크리덴셜 필수값이 유효하게 입력되어 있다
      | field                   | value                        |
      | 아이디                  | dockeruser                   |
      | 토큰                    | dockertoken                  |
      | Private Registry URL    | https://index.docker.io/v1/  |
    When 크리덴셜 추가 버튼을 클릭한다
    Then 크리덴셜 이름 필드에 "필수 입력 값입니다." 에러 메시지가 표시된다

  @regression
  Scenario: 이름이 4자 미만일 경우 유효성 에러 표시
    Given 크리덴셜 필수값이 유효하게 입력되어 있다
      | field                   | value                        |
      | 이름                    | abc                          |
      | 아이디                  | dockeruser                   |
      | 토큰                    | dockertoken                  |
      | Private Registry URL    | https://index.docker.io/v1/  |
    When 크리덴셜 추가 버튼을 클릭한다
    Then 크리덴셜 이름 필드에 "이름은 4자 이상 입력해 주세요." 에러 메시지가 표시된다

  @regression
  Scenario: 이름이 51자 이상일 경우 유효성 에러 표시
    Given 크리덴셜 필수값이 유효하게 입력되어 있다
      | field                   | value                        |
      | 아이디                  | dockeruser                   |
      | 토큰                    | dockertoken                  |
      | Private Registry URL    | https://index.docker.io/v1/  |
    When 크리덴셜 이름 필드에 51자 문자열을 입력한다
    And 크리덴셜 추가 버튼을 클릭한다
    Then 크리덴셜 이름 필드에 "이름은 50자 이내로 입력해 주세요." 에러 메시지가 표시된다

  @regression
  Scenario: 이름에 허용되지 않은 특수문자가 포함된 경우 유효성 에러 표시
    Given 크리덴셜 필수값이 유효하게 입력되어 있다
      | field                   | value                        |
      | 이름                    | abc@123                      |
      | 아이디                  | dockeruser                   |
      | 토큰                    | dockertoken                  |
      | Private Registry URL    | https://index.docker.io/v1/  |
    When 크리덴셜 추가 버튼을 클릭한다
    Then 크리덴셜 이름 필드에 "한글, 영문, 숫자, -, _, .만 사용할 수 있습니다." 에러 메시지가 표시된다

  # ============================================
  # 아이디 필드 유효성 검증
  # ============================================

  @regression
  Scenario: 아이디 미입력 시 유효성 에러 표시
    Given 크리덴셜 필수값이 유효하게 입력되어 있다
      | field                   | value                        |
      | 이름                    | mycred                       |
      | 토큰                    | dockertoken                  |
      | Private Registry URL    | https://index.docker.io/v1/  |
    When 크리덴셜 추가 버튼을 클릭한다
    Then 크리덴셜 아이디 필드에 "필수 입력 값입니다." 에러 메시지가 표시된다

  @regression
  Scenario: 아이디가 3자 미만일 경우 유효성 에러 표시
    Given 크리덴셜 필수값이 유효하게 입력되어 있다
      | field                   | value                        |
      | 이름                    | mycred                       |
      | 아이디                  | ab                           |
      | 토큰                    | dockertoken                  |
      | Private Registry URL    | https://index.docker.io/v1/  |
    When 크리덴셜 추가 버튼을 클릭한다
    Then 크리덴셜 아이디 필드에 "아이디는 3자 이상 입력해 주세요." 에러 메시지가 표시된다

  # ============================================
  # 토큰 필드 유효성 검증
  # ============================================

  @regression
  Scenario: 토큰 미입력 시 유효성 에러 표시
    Given 크리덴셜 필수값이 유효하게 입력되어 있다
      | field                   | value                        |
      | 이름                    | mycred                       |
      | 아이디                  | dockeruser                   |
      | Private Registry URL    | https://index.docker.io/v1/  |
    When 크리덴셜 추가 버튼을 클릭한다
    Then 크리덴셜 토큰 필드에 "필수 입력 값입니다." 에러 메시지가 표시된다

  @regression
  Scenario: 토큰이 4자 미만일 경우 유효성 에러 표시
    Given 크리덴셜 필수값이 유효하게 입력되어 있다
      | field                   | value                        |
      | 이름                    | mycred                       |
      | 아이디                  | dockeruser                   |
      | 토큰                    | abc                          |
      | Private Registry URL    | https://index.docker.io/v1/  |
    When 크리덴셜 추가 버튼을 클릭한다
    Then 크리덴셜 토큰 필드에 "토큰은 4자 이상 입력해 주세요." 에러 메시지가 표시된다

  # ============================================
  # Private Registry URL 필드 유효성 검증
  # ============================================

  @regression
  Scenario: Private Registry URL 미입력 시 유효성 에러 표시
    Given 크리덴셜 필수값이 유효하게 입력되어 있다
      | field  | value      |
      | 이름   | mycred     |
      | 아이디 | dockeruser |
      | 토큰   | abcd1234   |
    When 크리덴셜 추가 버튼을 클릭한다
    Then 크리덴셜 Private Registry URL 필드에 "Private Registry URL을 입력해 주세요." 에러 메시지가 표시된다
