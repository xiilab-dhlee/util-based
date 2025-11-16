"use client";

import { redfishThermalColumn } from "./redfish-thermal-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { useGetRedfishSystemChassis } from "@/hooks/node/use-get-redfish-system-chassis";
import { DetailContentSubTitle } from "@/styles/layers/detail-page-layers.styled";
import { DetailContentFeature } from "@/styles/layers/detail-page-vertical-layers.styled";

/**
 * Redfish 시스템의 열 관리(Thermal) 정보를 읽기 전용으로 표시하는 컴포넌트
 *
 * BMC IP를 통해 Redfish 시스템의 케이스 정보를 조회하여
 * 열 관리 관련 데이터를 테이블 형태로 표시합니다.
 *
 * @param bmcIp - BMC IP 주소
 */
interface ReadonlyThermalProps {
  bmcIp: string;
}

export function ReadonlyThermal({ bmcIp }: ReadonlyThermalProps) {
  // Redfish 시스템 케이스 정보 조회
  const { data } = useGetRedfishSystemChassis(bmcIp);

  return (
    <DetailContentFeature className="first last">
      <DetailContentSubTitle>Thermal</DetailContentSubTitle>
      {/* 열 관리 정보 테이블 */}
      <CustomizedTable
        columns={redfishThermalColumn}
        data={data?.thermals || []}
        columnHeight={32}
        bodyBgColor="transparent"
        activePadding
      />
    </DetailContentFeature>
  );
}
