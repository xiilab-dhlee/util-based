"use client";

import UnconnectRedfish from "../redfish/unconnect-redfish";

/**
 * Redfish 미연동 상태의 로그 컴포넌트
 *
 * 노드에 Redfish가 연동되지 않은 경우 표시되는 컴포넌트로,
 * Redfish 연동을 위한 UI를 제공합니다.
 */
export function UnreadyLog() {
  return <UnconnectRedfish />;
}

