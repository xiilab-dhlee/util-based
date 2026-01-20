@credential
Feature: 크리덴셜 추가 모달 진입
  As a 로그인한 사용자,
  I want to 크리덴셜 추가 모달을 열면
  So that 크리덴셜 추가 폼을 확인하고 입력을 시작할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 사용자 설정 페이지에 있다
    And 크리덴셜 추가 버튼이 표시된다

  @smoke
  Scenario: 크리덴셜 추가 모달 진입
    When 사용자가 크리덴셜 추가 버튼을 클릭한다
    Then 크리덴셜 추가 모달이 표시된다
    And 크리덴셜 타입이 "GitHub"으로 설정되어 있다
    And 크리덴셜 이름 입력창이 빈 값이다
    And 크리덴셜 설명 입력창이 빈 값이다
    And 크리덴셜 아이디 입력창이 빈 값이다
    And 크리덴셜 토큰 입력창이 빈 값이다
    And 크리덴셜 Private Registry URL 입력창이 표시되지 않는다

  @regression
  Scenario: Docker 타입 선택 시 Private Registry URL 필드가 표시된다
    Given 크리덴셜 추가 모달이 열린 상태이다
    When 크리덴셜 타입을 "Docker"로 선택한다
    Then 크리덴셜 Private Registry URL 입력창이 표시된다
    And 크리덴셜 Private Registry URL 입력창이 빈 값이다
