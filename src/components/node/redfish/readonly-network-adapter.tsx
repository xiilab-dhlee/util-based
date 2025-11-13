"use client";

import redfishNetworkAdapterColumn from "@/components/common/columns/redfish-network-adapter-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { useGetRedfishSystemNetworkAdapter } from "@/hooks/node/use-get-redfish-system-network-adapter";
import { DetailContentSubTitle } from "@/styles/layers/detail-page-layers.styled";
import { DetailContentFeature } from "@/styles/layers/detail-page-vertical-layers.styled";
import NetworkAdapterRow from "./network-adapter-row";

/**
 * Redfish 시스템의 네트워크 어댑터 정보를 읽기 전용으로 표시하는 컴포넌트
 *
 * BMC IP와 시스템 ID를 통해 Redfish 시스템의 네트워크 어댑터 정보를 조회하여
 * 네트워크 어댑터 목록을 테이블 형태로 표시합니다.
 * 각 어댑터는 확장 가능한 행으로 구성되어 상세 정보를 제공합니다.
 *
 * @param bmcIp - BMC IP 주소
 * @param systemId - 시스템 ID
 */
interface ReadonlyNetworkAdapterProps {
  bmcIp: string;
  systemId: string;
}

export function ReadonlyNetworkAdapter({
  bmcIp,
  systemId,
}: ReadonlyNetworkAdapterProps) {
  // Redfish 시스템 네트워크 어댑터 정보 조회
  const { data } = useGetRedfishSystemNetworkAdapter(bmcIp, systemId);

  return (
    <DetailContentFeature className="first last">
      <DetailContentSubTitle>Network Adapters</DetailContentSubTitle>
      {/* 네트워크 어댑터 테이블 */}
      <CustomizedTable
        columns={redfishNetworkAdapterColumn}
        data={data?.members || []}
        columnHeight={32}
        bodyBgColor="transparent"
        activePadding
        customRow={NetworkAdapterRow}
      />
    </DetailContentFeature>
  );
}

