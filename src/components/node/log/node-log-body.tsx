"use client";

import styled from "styled-components";

import { useGetNodeBmcInfo } from "@/hooks/node/use-get-bmc-info";
import RedfishPrimaryArticle from "../redfish/redfish-primary-article";
import ReadyLog from "./ready-log";
import UnreadyLog from "./unready-log";

/**
 * 노드 로그 페이지의 메인 바디 컴포넌트
 *
 * 노드의 BMC 정보를 조회하여 Redfish 연동 상태에 따라
 * 적절한 로그 컴포넌트를 렌더링합니다.
 *
 * @param nodeIp - 노드의 IP 주소
 */
interface NodeLogBodyProps {
  nodeIp: string;
}

export function NodeLogBody({ nodeIp }: NodeLogBodyProps) {
  // 노드의 BMC 정보 조회
  const { data } = useGetNodeBmcInfo(nodeIp);

  return (
    <Container>
      {/* 로그 페이지 헤더 */}
      <RedfishPrimaryArticle
        title="로그"
        description="노드의 로그를 확인할 수 있습니다."
      />
      {/* BMC 연동 상태에 따른 조건부 렌더링 */}
      {data ? <ReadyLog /> : <UnreadyLog />}
    </Container>
  );
}


/** 메인 컨테이너 - 세로 방향 레이아웃 */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
`;
