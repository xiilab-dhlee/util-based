@workload-list @interaction
Feature: 비활성화 워크로드 목록 페이지 인터랙션
  As a 사용자,
  I want to 비활성화 워크로드 목록에서 다양한 인터랙션을 수행하면
  So that 원하는 워크로드를 찾고 조회할 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 비활성화 워크로드 목록 페이지에 있다

  # ============================================
  # 필터링
  # ============================================

  @regression
  Scenario Outline: 워크로드 탐색 <설명>
    When 필터 조건을 설정한다:
      | search   | jobType   | status |
      | <search> | <jobType> | -      |
    Then 필터 UI가 설정된 조건을 표시한다:
      | search   | jobType   | status |
      | <search> | <jobType> | -      |
    And 필터링된 목록이 조건에 맞게 표시된다:
      | search   | jobType   | status |
      | <search> | <jobType> | -      |

    # 핵심 조합만 테스트: 단일 필터, 검색+필터 (상태 필터 없음)
    Examples:
      | 설명             | search | jobType     |
      | 잡타입 단일 필터 | -      | Batch       |
      | 검색             | auto   | -           |
      | 검색+잡타입      | auto   | Interactive |

  # ============================================
  # 액션 (삭제, 재시작)
  # ============================================

  @regression
  Scenario Outline: 워크로드 삭제 <결과>
    When 첫 번째 워크로드의 삭제 버튼을 클릭한다
    And 확인 모달의 <버튼> 버튼을 클릭한다
    Then 확인 모달이 닫힌다

    Examples:
      | 결과 | 버튼 |
      | 확인 | 확인 |
      | 취소 | 취소 |

  @regression
  Scenario Outline: 워크로드 재시작 <결과>
    When 첫 번째 워크로드의 재시작 버튼을 클릭한다
    And 확인 모달의 <버튼> 버튼을 클릭한다
    Then 확인 모달이 닫힌다

    Examples:
      | 결과 | 버튼 |
      | 확인 | 확인 |
      | 취소 | 취소 |
