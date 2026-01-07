@account-list @interaction @admin-only
Feature: 계정 관리 목록 페이지 인터랙션
  As a 관리자,
  I want to 계정 관리 목록에서 다양한 인터랙션을 수행하면
  So that 원하는 계정을 찾고 관리할 수 있다

  Background:
    Given 관리자가 로그인되어 있다
    And 계정 관리 목록 페이지에 있다

  @regression
  Scenario: 계정 상세 모달 열기
    When 첫 번째 계정의 이름을 클릭한다
    Then "계정 상세" 모달이 표시된다

  @regression
  Scenario: 계정 수정 모달 열기
    When 첫 번째 계정의 수정 버튼을 클릭한다
    Then "계정 수정" 모달이 표시된다

  @regression
  Scenario: 비밀번호 초기화 모달 열기
    When 첫 번째 계정의 PW 초기화 버튼을 클릭한다
    Then "비밀번호 초기화" 모달이 표시된다

  @regression
  Scenario Outline: 계정 검색 - <설명>
    When 목록 페이지의 검색창에 "<검색어>"를 입력한다
    Then 계정 검색 결과 검색어가 포함된 데이터만 표시된다

    Examples:
      | 설명            | 검색어    |
      | 일반 검색어     | admin     |
      | 한글 검색       | 테스트    |
      | 대문자 검색     | ADMIN     |
      | 이메일 검색     | @example  |

  # @regression
  # Scenario Outline: 계정 목록 정렬 - <정렬기준> <정렬순서>
  #   When 계정 목록을 "<정렬기준>" 기준 "<정렬순서>"으로 정렬한다
  #   Then 계정 목록이 "<정렬기준>" 기준 "<정렬순서>"으로 정렬되어 표시된다
  #
  #   Examples:
  #     | 정렬기준 | 정렬순서 |
  #     | 이름     | 오름차순 |
  #     | 이름     | 내림차순 |
  #     | 가입일   | 오름차순 |
  #     | 가입일   | 내림차순 |

  # @regression
  # Scenario Outline: 계정 상태 변경 <결과>
  #   When 첫 번째 계정의 상태 스위치를 클릭한다
  #   And "계정 상태 변경" 모달의 <버튼> 버튼을 클릭한다
  #   Then "계정 상태 변경" 모달이 닫힌다
  #
  #   Examples:
  #     | 결과 | 버튼 |
  #     | 확인 | 확인 |
  #     | 취소 | 취소 |
