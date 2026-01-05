@hub @validation
Feature: 허브 페이지 데이터 검증
  As a 사용자,
  I want to 허브 페이지의 데이터가 올바르게 표시되는지 확인하여
  So that 정확한 허브 정보를 기반으로 워크로드를 생성할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 허브 페이지에 있다

  @regression
  Scenario: 허브 카드 데이터 유효성 검증
    Then 각 허브 카드의 이름이 빈 값이 아니다
    And 각 허브 카드의 모델 타입이 빈 값이 아니다
