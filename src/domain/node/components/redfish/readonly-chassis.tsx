"use client";

import { ChassisRow } from "@/domain/node/components/redfish/chassis-row";
import { useGetRedfishSystemChassis } from "@/domain/node/hooks/use-get-redfish-system-chassis";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { DetailContentSubTitle } from "@/styles/layers/detail-page-layers.styled";
import { DetailContentFeature } from "@/styles/layers/detail-page-vertical-layers.styled";
import { redfishChassisColumn } from "./redfish-chassis-column";

/**
 * Redfish 시스템의 케이스 정보를 읽기 전용으로 표시하는 컴포넌트
 *
 * BMC IP를 통해 Redfish 시스템의 케이스 정보를 조회하여
 * 케이스 목록을 테이블 형태로 표시합니다.
 * 각 케이스는 확장 가능한 행으로 구성되어 상세 정보를 제공합니다.
 *
 * @param bmcIp - BMC IP 주소
 */
interface ReadonlyChassisProps {
  bmcIp: string;
}

export function ReadonlyChassis({ bmcIp }: ReadonlyChassisProps) {
  // Redfish 시스템 케이스 정보 조회
  const { data } = useGetRedfishSystemChassis(bmcIp);

  return (
    <DetailContentFeature className="first last">
      <DetailContentSubTitle>Chassis</DetailContentSubTitle>
      {/* 케이스 테이블 */}
      <CustomizedTable
        columns={redfishChassisColumn}
        data={data?.members || []}
        columnHeight={32}
        bodyBgColor="transparent"
        activePadding
        customRow={ChassisRow}
      />
    </DetailContentFeature>
  );
}
