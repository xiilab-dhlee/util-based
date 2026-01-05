import {
  getFindHubDetailMockHandler,
  getFindHubSummariesMockHandler,
  getFindHubsMockHandler,
  getFindHubsResponseMock,
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

/**
 * Hub MSW Handlers
 *
 * orval에서 생성된 hub.msw.ts의 handler 함수들을 활용하여
 * keyword 기반 동적 응답을 구현합니다.
 *
 * getFindHubsResponseMock()의 기본 데이터를 그대로 사용하고,
 * keyword가 있을 때만 hubName을 "keyword-N" 형식으로 오버라이드합니다.
 */
export const hubHandlers = [
  // 허브 목록 조회 (pageSize에 맞는 개수, keyword가 있으면 hubName 오버라이드)
  getFindHubsMockHandler(async (info) => {
    // URL에서 query params 추출
    const url = new URL(info.request.url);
    const keyword = url.searchParams.get("keyword") || "";
    const pageNo = parseInt(url.searchParams.get("pageNo") || "0", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "12", 10);

    const { status, message, timestamp } = getFindHubsResponseMock();

    // pageSize에 맞는 content 생성
    const content = Array.from({ length: pageSize }, (_, index) => {
      return {
        hubId: pageNo * pageSize + index + 1,
        hubName: `${keyword ? keyword : "HUB"}-${pageNo * pageSize + index + 1}`,
        modelType: "Object Detection",
        description:
          "YOLO(You Only Look Once)는 Object detection 모델 중 하나로, 높은 속도와 정확도를 가집니다.".repeat(
            3,
          ),
        thumbnail: "/images/hub-thumbnail.png",
      };
    });

    // 총 데이터 개수 (3페이지 분량으로 가정)
    const totalSize = pageSize * 3;

    return {
      status,
      message,
      timestamp,
      data: {
        totalSize,
        totalPageNum: Math.ceil(totalSize / pageSize),
        currentPageNo: pageNo,
        content,
      },
    };
  }),

  // 허브 상세 조회 (README 반환)
  getFindHubDetailMockHandler(() => HUB_README_MOCK),

  // 허브 요약 목록 조회
  getFindHubSummariesMockHandler(),
];
