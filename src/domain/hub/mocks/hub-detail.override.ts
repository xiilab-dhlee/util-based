import {
  getFindHubDetailMockHandler,
  getFindHubSummariesMockHandler,
} from "@/api/generated/hub/hub.msw";

/**
 * 허브 README 모킹 데이터
 */
const HUB_README_MOCK = `# Sample Hub README

This is a sample README for the Hub.

## Features

- Feature 1: Easy to use
- Feature 2: High performance
- Feature 3: Well documented

## Installation

\`\`\`bash
npm install sample-hub
\`\`\`

## Usage

\`\`\`javascript
import { SampleHub } from 'sample-hub';

const hub = new SampleHub();
hub.start();
\`\`\`

## License

MIT License
`;

export const hubDetailOverrideHandlers = [
  // 허브 상세 조회 (README 반환)
  getFindHubDetailMockHandler(HUB_README_MOCK),

  // 허브 요약 목록 조회
  getFindHubSummariesMockHandler(),
];
