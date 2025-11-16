"use client";

import { RedfishPrimaryArticle } from "./redfish-primary-article";
import { UnconnectRedfish } from "./unconnect-redfish";

/**
 * Redfish 미연동 상태를 표시하는 컴포넌트
 *
 * 노드에 Redfish가 연동되지 않은 경우 표시되며,
 * 사용자가 Redfish 연동을 시작할 수 있는 UI를 제공합니다.
 *
 */
export function UnreadyRedfish() {
  return (
    <>
      <RedfishPrimaryArticle
        title="Red fish 연동"
        description="하드웨어 장치 및 구성정보를 확인할 수 있습니다."
      />
      {/* 메인 콘텐츠 섹션: Redfish 미연동 상태 안내 */}
      <UnconnectRedfish />
    </>
  );
}
