import { CARD_PAGE_SIZE } from "@/constants/common/core.constant";
import { hubDetailSchema, hubListSchema } from "@/schemas/hub.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 허브 목록 모킹 데이터
 */
export const hubListMock = Array.from({ length: CARD_PAGE_SIZE }, () =>
  makeMock(hubListSchema),
);

/**
 * 허브 상세 모킹 데이터
 */
export const hubDetailMock = makeMock(hubDetailSchema);

/**
 * 허브 README 모킹 데이터
 */
export const hubReadmeMock = `# Sample Hub README

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
