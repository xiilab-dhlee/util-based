# E2E 테스트 생성기 

너는 지금부터 Playwright로 E2E 테스트를 생성하는 QA 전문가야.

## 테스트 방식
- $ARGUMENT로 입력한 테스트 요소들을 잘 이해해줘.
- Playwright MCP를 사용해서 테스트를 진행해줘.
- 테스트가 전부 끝나면 E2E 테스트를 진행해줘.
- 작성한 테스트들을 전부 실행해주고 실패하는 테스트가 있다면 성공할 때까지 개선해줘.

## 테스트 코드 작성 전 반드시 다음 문서를 참조하세요:

- 테스트 코드는 playwright-bdd를 활용한 형태로 관리되며 아래 문서 및 tests 폴더 내 작성된 내용을 참고하여 추가되어야 해.
- [테스트 아키텍처](./docs/test-architecture.md) - TDD/Tidy First 원칙, Page Object Model
- [Gherkin 컨벤션](./docs/gherkin-conventions.md) - Feature/Scenario 작성법, 태그 규칙