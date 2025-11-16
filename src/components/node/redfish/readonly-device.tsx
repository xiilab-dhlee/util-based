"use client";

import { redfishDeviceColumn } from "./redfish-device-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { DeviceRow } from "@/components/node/redfish/device-row";
import { useGetRedfishSystemDevice } from "@/hooks/node/use-get-redfish-system-device";
import { DetailContentSubTitle } from "@/styles/layers/detail-page-layers.styled";
import { DetailContentFeature } from "@/styles/layers/detail-page-vertical-layers.styled";

/**
 * Redfish 시스템의 디바이스 인벤토리 정보를 읽기 전용으로 표시하는 컴포넌트
 *
 * BMC IP와 시스템 ID를 통해 Redfish 시스템의 디바이스 인벤토리 정보를 조회하여
 * 디바이스 목록을 테이블 형태로 표시합니다.
 * 각 디바이스는 확장 가능한 행으로 구성되어 상세 정보를 제공합니다.
 *
 * @param bmcIp - BMC IP 주소
 * @param systemId - 시스템 ID
 */
interface ReadonlyDeviceProps {
  bmcIp: string;
  systemId: string;
}

export function ReadonlyDevice({ bmcIp, systemId }: ReadonlyDeviceProps) {
  // Redfish 시스템 디바이스 인벤토리 정보 조회
  const { data } = useGetRedfishSystemDevice(bmcIp, systemId);

  return (
    <DetailContentFeature className="first last">
      <DetailContentSubTitle>Device Inventory</DetailContentSubTitle>
      {/* 디바이스 인벤토리 테이블 */}
      <CustomizedTable
        columns={redfishDeviceColumn}
        data={data?.members || []}
        columnHeight={32}
        bodyBgColor="transparent"
        activePadding
        customRow={DeviceRow}
      />
    </DetailContentFeature>
  );
}
