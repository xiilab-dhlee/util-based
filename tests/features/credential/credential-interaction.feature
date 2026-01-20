@credential @interaction
Feature: 크리덴셜 추가 성공 케이스
  As a 로그인한 사용자,
  I want to 유효한 크리덴셜 정보를 입력하고 추가하면
  So that 새로운 크리덴셜이 정상적으로 등록된다

  Background:
    Given 사용자가 로그인되어 있다
    And 사용자 설정 페이지에 있다
    And 크리덴셜 추가 모달이 열린 상태이다

  # ============================================
  # Git 크리덴셜 추가 성공
  # ============================================

  @smoke
  Scenario: Git 크리덴셜 필수값만 입력하여 추가
    Given 크리덴셜 타입이 "GitHub"으로 설정되어 있다
    And 크리덴셜 필수값이 유효하게 입력되어 있다
      | field  | value    |
      | 이름   | mycred   |
      | 아이디 | gituser  |
      | 토큰   | abcd1234 |
    When 크리덴셜 추가 버튼을 클릭한다
    Then 크리덴셜 추가 모달이 닫힌다
    And 크리덴셜 목록에 "mycred"가 추가된다

  @regression
  Scenario: Git 크리덴셜 설명 포함하여 추가
    Given 크리덴셜 타입이 "GitHub"으로 설정되어 있다
    And 크리덴셜 필수값이 유효하게 입력되어 있다
      | field  | value           |
      | 이름   | my-git-cred     |
      | 설명   | Git 인증 정보   |
      | 아이디 | gituser         |
      | 토큰   | token1234       |
    When 크리덴셜 추가 버튼을 클릭한다
    Then 크리덴셜 추가 모달이 닫힌다
    And 크리덴셜 목록에 "my-git-cred"가 추가된다

  # ============================================
  # Docker 크리덴셜 추가 성공
  # ============================================

  @smoke
  Scenario: Docker 크리덴셜 필수값만 입력하여 추가
    Given 크리덴셜 타입을 "Docker"로 선택한다
    And 크리덴셜 필수값이 유효하게 입력되어 있다
      | field                 | value                       |
      | 이름                  | mycred                      |
      | 아이디                | dockeruser                  |
      | 토큰                  | abcd1234                    |
      | Private Registry URL  | https://index.docker.io/v1/ |
    When 크리덴셜 추가 버튼을 클릭한다
    Then 크리덴셜 추가 모달이 닫힌다
    And 크리덴셜 목록에 "mycred"가 추가된다

  @regression
  Scenario: Docker 크리덴셜 설명 포함하여 추가
    Given 크리덴셜 타입을 "Docker"로 선택한다
    And 크리덴셜 필수값이 유효하게 입력되어 있다
      | field                 | value                       |
      | 이름                  | my-docker-cred              |
      | 설명                  | Docker 인증 정보            |
      | 아이디                | dockeruser                  |
      | 토큰                  | token1234                   |
      | Private Registry URL  | https://index.docker.io/v1/ |
    When 크리덴셜 추가 버튼을 클릭한다
    Then 크리덴셜 추가 모달이 닫힌다
    And 크리덴셜 목록에 "my-docker-cred"가 추가된다

  # ============================================
  # 모달 닫기/취소 동작
  # ============================================

  @regression
  Scenario: 취소 버튼 클릭 시 모달이 닫힌다
    Given 크리덴셜 이름 필드에 "test-cred"를 입력한다
    When 크리덴셜 취소 버튼을 클릭한다
    Then 크리덴셜 추가 모달이 닫힌다

  @regression
  Scenario: 모달 닫기 후 재진입 시 폼이 초기화된다
    Given 크리덴셜 이름 필드에 "test-cred"를 입력한다
    And 크리덴셜 아이디 필드에 "testuser"를 입력한다
    When 크리덴셜 취소 버튼을 클릭한다
    And 사용자가 크리덴셜 추가 버튼을 클릭한다
    Then 크리덴셜 이름 입력창이 빈 값이다
    And 크리덴셜 아이디 입력창이 빈 값이다
