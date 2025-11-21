"use client";

import { useParams } from "next/navigation";

import { ManageBmcModal } from "@/domain/node/components/manage-bmc-modal";
import { useGetNode } from "@/domain/node/hooks/use-get-node";
import { NodeRedfishBody } from "./node-redfish-body";
import { ViewNetworkAdapterModal } from "./view-network-adapter-modal";

/**
 * 노드 Redfish 페이지의 최상위 컴포넌트
 *
 * URL 파라미터에서 노드 이름을 추출하여 노드 정보를 조회하고,
 * 노드 IP가 있는 경우에만 Redfish 바디 컴포넌트를 렌더링합니다.
 * BMC 관리 모달과 네트워크 어댑터 모달도 함께 제공합니다.
 */
export function NodeRedfishMain() {
  // URL 파라미터에서 노드 이름 추출
  const { name } = useParams();

  // 노드 정보 조회
  const { data } = useGetNode(String(name));

  return (
    <>
      {/* 노드 IP가 있는 경우에만 Redfish 바디 렌더링 */}
      {data?.ip && <NodeRedfishBody nodeIp={data.ip} />}
      {/* BMC 관리(Create/Update) 모달 */}
      <ManageBmcModal />
      {/* Network Adapter 모달 */}
      <ViewNetworkAdapterModal />
    </>
  );
}
