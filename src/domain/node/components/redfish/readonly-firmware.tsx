"use client";

import { useGetRedfishSystemFirmware } from "@/domain/node/hooks/use-get-redfish-system-firmware";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { DetailContentSubTitle } from "@/styles/layers/detail-page-layers.styled";
import { DetailContentFeature } from "@/styles/layers/detail-page-vertical-layers.styled";
import { FirmwareRow } from "./firmware-row";
import { redfishFirmwareColumn } from "./redfish-firmware-column";

/**
 * Redfish 시스템의 펌웨어 정보를 읽기 전용으로 표시하는 컴포넌트
 *
 * BMC IP를 통해 Redfish 시스템의 펌웨어 정보를 조회하여
 * 펌웨어 목록을 테이블 형태로 표시합니다.
 * 각 펌웨어는 확장 가능한 행으로 구성되어 상세 정보를 제공합니다.
 *
 * @param bmcIp - BMC IP 주소
 */
interface ReadonlyFirmwareProps {
  bmcIp: string;
}

export function ReadonlyFirmware({ bmcIp }: ReadonlyFirmwareProps) {
  // Redfish 시스템 펌웨어 정보 조회
  const { data } = useGetRedfishSystemFirmware(bmcIp);

  return (
    <DetailContentFeature className="first last">
      <DetailContentSubTitle>Firmware</DetailContentSubTitle>
      {/* 펌웨어 테이블 */}
      <CustomizedTable
        columns={redfishFirmwareColumn}
        data={data?.members || []}
        columnHeight={32}
        bodyBgColor="transparent"
        activePadding
        customRow={FirmwareRow}
      />
    </DetailContentFeature>
  );
}
