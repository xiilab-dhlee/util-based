"use client";

import { useMemo } from "react";
import styled from "styled-components";

import { useGetRedfishSystemMemory } from "@/domain/node/hooks/use-get-redfish-system-memory";
import type {
  MemoryInfoType,
  MemoryMemberType,
} from "@/domain/node/schemas/redfish.schema";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import {
  DetailContentKey,
  DetailContentSubTitle,
} from "@/styles/layers/detail-page-layers.styled";
import {
  DetailContentFeature,
  DetailContentFeatureBody,
  DetailContentFeaturePane,
  DetailContentFeatureRow,
  DetailContentPaneValue,
} from "@/styles/layers/detail-page-vertical-layers.styled";
import { MemoryRow } from "./memory-row";
import { redfishMemoryColumn } from "./redfish-memory-column";

/**
 * Redfish 시스템의 메모리 정보를 읽기 전용으로 표시하는 컴포넌트
 *
 * BMC IP와 시스템 ID를 통해 Redfish 시스템의 메모리 정보를 조회하여
 * 총 메모리, 동작 주파수, 동작 전압, AMP 모드 등의 요약 정보와
 * 개별 메모리 모듈의 상세 정보를 테이블 형태로 표시합니다.
 *
 * @param bmcIp - BMC IP 주소
 * @param systemId - 시스템 ID
 */
interface ReadonlyMemoryProps {
  bmcIp: string;
  systemId: string;
}

export function ReadonlyMemory({ bmcIp, systemId }: ReadonlyMemoryProps) {
  // Redfish 시스템 메모리 정보 조회
  const { data } = useGetRedfishSystemMemory(bmcIp, systemId);

  // 총 메모리 용량 계산 (MB → GiB 변환)
  const totalMemory = useMemo(() => {
    const memories = data?.Oem?.Hpe?.MemoryList;
    if (!memories) return "-";
    if (memories.length === 0) return "0 GiB";
    const totalMemoryMB = memories.reduce(
      (
        sum: number,
        board: MemoryInfoType["Oem"]["Hpe"]["MemoryList"][number],
      ) => sum + board.BoardTotalMemorySize,
      0,
    );
    const totalMemoryGB = totalMemoryMB / 1024;
    return `${totalMemoryGB.toFixed(0)} GiB`;
  }, [data?.Oem?.Hpe?.MemoryList]);

  // 동작 주파수 계산 (첫 번째 메모리 모듈 기준)
  const operatingFrequency = useMemo(() => {
    const memories = data?.Oem?.Hpe?.MemoryList;
    if (!memories) return "-";
    if (memories.length === 0) return "0 MHz";
    return `${memories[0].BoardOperationalFrequency} MHz`;
  }, [data?.Oem?.Hpe?.MemoryList]);

  // 동작 전압 계산 (mV → V 변환)
  const operatingVoltage = useMemo(() => {
    const memories = data?.Oem?.Hpe?.MemoryList;
    if (!memories) return "-";
    if (memories.length === 0 || !memories[0].BoardOperationalVoltage)
      return "0 volts";
    return `${(memories[0].BoardOperationalVoltage / 1000).toFixed(1)} volts`;
  }, [data?.Oem?.Hpe?.MemoryList]);

  return (
    <DetailContentFeature className="first last">
      <DetailContentSubTitle>Memory</DetailContentSubTitle>

      {/* 메모리 요약 정보 */}
      <StyledDetailContentFeatureBody>
        <StyledDetailContentFeaturePane>
          <StyledDetailContentFeatureRow className="last">
            <DetailContentKey>Total memory</DetailContentKey>
            <DetailContentPaneValue className="truncate" title={totalMemory}>
              {totalMemory}
            </DetailContentPaneValue>
          </StyledDetailContentFeatureRow>
          <StyledDetailContentFeatureRow className="last"></StyledDetailContentFeatureRow>
        </StyledDetailContentFeaturePane>
        <StyledDetailContentFeaturePane>
          <StyledDetailContentFeatureRow>
            <DetailContentKey>Operating frequency</DetailContentKey>
            <DetailContentPaneValue
              className="truncate"
              title={operatingFrequency}
            >
              {operatingFrequency}
            </DetailContentPaneValue>
          </StyledDetailContentFeatureRow>
          <StyledDetailContentFeatureRow className="last">
            <DetailContentKey>Operating voltage</DetailContentKey>
            <DetailContentPaneValue
              className="truncate"
              title={operatingVoltage}
            >
              {operatingVoltage}
            </DetailContentPaneValue>
          </StyledDetailContentFeatureRow>
        </StyledDetailContentFeaturePane>
        <StyledDetailContentFeaturePane>
          <StyledDetailContentFeatureRow>
            <DetailContentKey>Configured AMP mode</DetailContentKey>
            <DetailContentPaneValue
              className="truncate"
              title={data?.Oem?.Hpe?.AmpModeActive}
            >
              {data?.Oem?.Hpe?.AmpModeActive || "-"}
            </DetailContentPaneValue>
          </StyledDetailContentFeatureRow>
          <StyledDetailContentFeatureRow className="last">
            <DetailContentKey>AMP mode status</DetailContentKey>
            <DetailContentPaneValue
              className="truncate"
              title={data?.Oem?.Hpe?.AmpModeStatus}
            >
              {data?.Oem?.Hpe?.AmpModeStatus || "-"}
            </DetailContentPaneValue>
          </StyledDetailContentFeatureRow>
        </StyledDetailContentFeaturePane>
      </StyledDetailContentFeatureBody>

      {/* 개별 메모리 모듈 테이블 */}
      <CustomizedTable<MemoryMemberType>
        columns={redfishMemoryColumn}
        data={data?.members || []}
        columnHeight={32}
        bodyBgColor="transparent"
        activePadding
        customRow={MemoryRow}
      />
    </DetailContentFeature>
  );
}

/** 메모리 요약 정보 바디 스타일 */
const StyledDetailContentFeatureBody = styled(DetailContentFeatureBody)`
  margin-bottom: 10px;
`;

/** 메모리 요약 정보 패널 스타일 */
const StyledDetailContentFeaturePane = styled(DetailContentFeaturePane)`
  gap: 0px;
`;

/** 메모리 요약 정보 행 스타일 */
const StyledDetailContentFeatureRow = styled(DetailContentFeatureRow)`
  border-bottom: 1px dotted #e9edf2;
  padding: 5px 4px;
  height: 21px;

  &.last {
    border-color: transparent;
  }
`;
