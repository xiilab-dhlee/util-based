@private-registry-list @validation
Feature: 개인 레지스트리 목록 검증
  As a 사용자,
  I want to 개인 레지스트리 목록의 데이터가 올바르게 표시되는지 확인하여
  So that 컨테이너 이미지 정보를 정확하게 파악할 수 있다

  Background:
    Given 개인 레지스트리 목록 페이지에 있다

  @regression
  Scenario: 개인 레지스트리 목록 데이터 유효성 검증
    Then 각 개인 레지스트리의 이미지 이름이 빈 값이 아니다
    And 각 개인 레지스트리의 구분이 빈 값이 아니다
    And 각 개인 레지스트리의 최근 태그가 빈 값이 아니다
    And 각 개인 레지스트리의 태그 개수가 올바른 형식으로 표시된다
    And 각 개인 레지스트리의 다운로드 횟수가 올바른 형식으로 표시된다
    And 각 개인 레지스트리의 생성일이 올바른 형식으로 표시된다

  @regression
  Scenario: 등록 중인 이미지 데이터 유효성 검증
    Then 각 등록 중인 이미지의 이름이 표시된다
    And 각 등록 중인 이미지의 구분이 표시된다
    And 각 등록 중인 이미지의 상태가 표시된다
    And 각 등록 중인 이미지의 생성일시가 yyyy.MM.dd HH:mm:ss 형식으로 표시된다
