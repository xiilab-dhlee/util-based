"use client";

import { redfishPowerSupplyColumn } from "@/components/common/column/redfish-power-supply-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { useGetRedfishSystemChassis } from "@/hooks/node/use-get-redfish-system-chassis";
import { DetailContentSubTitle } from "@/styles/layers/detail-page-layers.styled";
import { DetailContentFeature } from "@/styles/layers/detail-page-vertical-layers.styled";
import PowerSuppliesRow from "./power-supplies-row";

/**
 * Redfish 시스템의 전원 공급 장치 정보를 읽기 전용으로 표시하는 컴포넌트
 *
 * BMC IP를 통해 Redfish 시스템의 케이스 정보를 조회하여
 * 전원 공급 장치 목록을 테이블 형태로 표시합니다.
 * 각 전원 공급 장치는 확장 가능한 행으로 구성되어 상세 정보를 제공합니다.
 *
 * @param bmcIp - BMC IP 주소
 */
interface ReadonlyPowerSuppliesProps {
  bmcIp: string;
}

export function ReadonlyPowerSupplies({ bmcIp }: ReadonlyPowerSuppliesProps) {
  // Redfish 시스템 케이스 정보 조회
  const { data } = useGetRedfishSystemChassis(bmcIp);

  return (
    <DetailContentFeature className="first last">
      <DetailContentSubTitle>Power Supplies</DetailContentSubTitle>
      {/* 전원 공급 장치 테이블 */}
      <CustomizedTable
        columns={redfishPowerSupplyColumn}
        data={data?.powerSupplies || []}
        columnHeight={32}
        bodyBgColor="transparent"
        activePadding
        customRow={PowerSuppliesRow}
      />
    </DetailContentFeature>
  );
}
