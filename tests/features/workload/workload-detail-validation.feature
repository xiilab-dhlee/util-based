@workload-detail @validation
Feature: 워크로드 상세 페이지 상태별 탭 활성화 검증
  As a 사용자,
  I want to 워크로드 상태에 따라 탭이 올바르게 활성화/비활성화되는지 확인하여
  So that 현재 상태에서 사용 가능한 기능을 명확히 알 수 있다

  Background:
    Given 사용자가 로그인되어 있다
    And 워크로드 상세 페이지에 있다

  @regression
  Scenario: 워크로드 이벤트 이력 데이터 유효성 검증
    Then 각 이벤트 이름이 표시된다
    And 각 이벤트 상태가 다음 중 하나이다:
      | 상태     |
      | Normal  |
      | Warning |
    And 각 이벤트 경과 시간이 yyyy.MM.dd HH:mm:ss 형식으로 표시된다
    And 각 이벤트 From이 표시된다
    And 각 이벤트 메시지가 표시된다

  @regression
  Scenario: 워크로드 소스코드 데이터 유효성 검증
    Then 각 소스코드 이름이 표시된다
    And 각 소스코드 상태가 다음 중 하나이다:
      | 상태    |
      | public  |
      | private |
    And 각 소스코드 경로가 표시된다
    And 각 소스코드 Git URL이 표시된다
    And 각 소스코드 타입이 다음 중 하나이다:
      | 타입      |
      | GitHub    |
      | GitLab    |
      | BitBucket |

  @regression
  Scenario: 워크로드 볼륨 데이터 유효성 검증
    Then 각 볼륨 이름이 표시된다
    And 각 볼륨 상태가 다음 중 하나이다:
      | 상태    |
      | public  |
      | private |
    And 각 볼륨 스토리지 타입이 다음 중 하나이다:
      | 타입    |
      | astrago |
      | local   |
    And 각 볼륨 경로가 표시된다
    And 각 볼륨 크기가 표시된다

  # ============================================
  # 상태별 탭 활성화 검증
  # ============================================

  @regression
  Scenario Outline: 상태별 탭 활성화 검증 (<상태명>)
    When 워크로드 상태가 "<상태>"인 것을 확인한다.
    Then "상세정보" 탭이 <상세정보>되어 있다
    And "로그" 탭이 <로그>되어 있다
    And "웹터미널" 탭이 <웹터미널>되어 있다
    And "모니터링" 탭이 <모니터링>되어 있다
    And "파일 목록" 탭이 <파일목록>되어 있다

    # 상태별 탭 활성화 규칙:
    # - 실행중(running): 모든 탭 활성화
    # - 종료(completed): 웹터미널, 파일 목록 비활성화
    # - 대기중(pending): 모든 부가 탭 비활성화
    # - 에러(failed): 모든 부가 탭 비활성화
    Examples:
      | 상태명 | 상태      | 상세정보 | 로그     | 웹터미널 | 모니터링 | 파일목록 |
      | 실행중 | running   | 활성화   | 활성화   | 활성화   | 활성화   | 활성화   |
      | 종료   | completed | 활성화   | 활성화   | 비활성화 | 활성화   | 비활성화 |
      | 대기중 | pending   | 활성화   | 비활성화 | 비활성화 | 비활성화 | 비활성화 |
      | 에러   | failed    | 활성화   | 비활성화 | 비활성화 | 비활성화 | 비활성화 |
