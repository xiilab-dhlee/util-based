"use client";

import redfishProcessorColumn from "@/components/common/column/redfish-processor-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { useGetRedfishSystemProcessors } from "@/hooks/node/use-get-redfish-system-processors";
import { DetailContentSubTitle } from "@/styles/layers/detail-page-layers.styled";
import { DetailContentFeature } from "@/styles/layers/detail-page-vertical-layers.styled";
import ProcessorRow from "./processor-row";

/**
 * Redfish 시스템의 프로세서 정보를 읽기 전용으로 표시하는 컴포넌트
 *
 * BMC IP와 시스템 ID를 통해 Redfish 시스템의 프로세서 정보를 조회하여
 * 프로세서 목록을 테이블 형태로 표시합니다.
 * 각 프로세서는 확장 가능한 행으로 구성되어 상세 정보를 제공합니다.
 *
 * @param bmcIp - BMC IP 주소
 * @param systemId - 시스템 ID
 */
interface ReadonlyProcessorProps {
  bmcIp: string;
  systemId: string;
}

export function ReadonlyProcessor({ bmcIp, systemId }: ReadonlyProcessorProps) {
  // Redfish 시스템 프로세서 정보 조회
  const { data } = useGetRedfishSystemProcessors(bmcIp, systemId);

  return (
    <DetailContentFeature className="first last">
      <DetailContentSubTitle>Processors</DetailContentSubTitle>
      {/* 프로세서 테이블 */}
      <CustomizedTable
        columns={redfishProcessorColumn}
        data={data?.members || []}
        columnHeight={32}
        bodyBgColor="transparent"
        activePadding
        customRow={ProcessorRow}
      />
    </DetailContentFeature>
  );
}
