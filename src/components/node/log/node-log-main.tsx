"use client";

import { useParams } from "next/navigation";

import { ManageBmcModal } from "@/components/common/modal/manage-bmc-modal";
import { useGetNode } from "@/hooks/node/use-get-node";
import { NodeLogBody } from "./node-log-body";

/**
 * 노드 로그 페이지의 최상위 컴포넌트
 *
 * URL 파라미터에서 노드 이름을 추출하여 노드 정보를 조회하고,
 * 노드 IP가 있는 경우에만 로그 바디 컴포넌트를 렌더링합니다.
 * BMC 관리 모달도 함께 제공합니다.
 */
export function NodeLogMain() {
  // URL 파라미터에서 노드 이름 추출
  const { name } = useParams();

  // 노드 정보 조회
  const { data } = useGetNode(String(name));

  return (
    <>
      {/* 노드 IP가 있는 경우에만 로그 바디 렌더링 */}
      {data?.ip && <NodeLogBody nodeIp={data.ip} />}
      {/* BMC 관리(Create/Update) 모달 */}
      <ManageBmcModal />
    </>
  );
}
