"use client";

import styled from "styled-components";

import { useGetNodeBmcInfo } from "@/domain/node/hooks/use-get-bmc-info";
import { ReadyRedfish } from "./ready-redfish";
import { UnreadyRedfish } from "./unready-redfish";

/**
 * 노드 Redfish 페이지의 메인 바디 컴포넌트
 *
 * 노드의 BMC 정보를 조회하여 Redfish 연동 상태에 따라
 * 적절한 Redfish 컴포넌트를 렌더링합니다.
 *
 * @param nodeIp - 노드의 IP 주소
 */
interface NodeRedfishBodyProps {
  nodeIp: string;
}

export function NodeRedfishBody({ nodeIp }: NodeRedfishBodyProps) {
  // 노드의 BMC 정보 조회
  const { data } = useGetNodeBmcInfo(nodeIp);

  return <Container>{data ? <ReadyRedfish /> : <UnreadyRedfish />}</Container>;
}

/** 메인 컨테이너 - 세로 방향 레이아웃 */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
`;
