import styled from "styled-components";

import type { CoreResourceType } from "@/shared/types/core.interface";

export interface ResourceProgressProps {
  resourceType: CoreResourceType;
  // 사용량
  usagePercent: number;
  // 요청량
  requestPercent?: number;
  height?: number;
  borderRadius?: number;
  backgroundColor?: string;
  // 커스텀 색상 (노드별 색상 지정용)
  customColor?: string;
}

export function ResourceProgress({
  resourceType,
  usagePercent,
  requestPercent,
  height = 4,
  borderRadius = 1,
  backgroundColor = "#292b32",
  customColor,
}: ResourceProgressProps) {
  return (
    <Container
      $height={height}
      $borderRadius={borderRadius}
      $backgroundColor={backgroundColor}
    >
      <UsageProgress
        className={resourceType}
        $percent={usagePercent}
        $customColor={customColor}
      />
      {requestPercent && (
        <RequestProgress
          className={resourceType}
          $percent={requestPercent}
          $customColor={customColor}
        />
      )}
    </Container>
  );
}

const Container = styled.div<{
  $height: number;
  $borderRadius: number;
  $backgroundColor: string;
}>`
  position: relative;
  border-radius: ${({ $borderRadius }) => $borderRadius}px;
  overflow: hidden;
  height: ${({ $height }) => $height}px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
`;

const UsageProgress = styled.div<{
  $percent: number;
  $customColor?: string;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  z-index: 10;
  border-radius: 1px;

  ${({ $customColor }) =>
    $customColor
      ? `background-color: ${$customColor};`
      : `
    &.GPU,
    &.MIG,
    &.MPS {
      background-color: var(--gpu-usage-color);
    }

    &.CPU {
      background-color: var(--cpu-usage-color);
    }

    &.MEM {
      background-color: var(--mem-usage-color);
    }

    &.DISK {
      background-color: var(--disk-usage-color);
    }
  `}
`;

const RequestProgress = styled(UsageProgress)`
  z-index: 9;
  border-radius: 1px;

  ${({ $customColor }) =>
    $customColor
      ? `background-color: ${$customColor}; opacity: 0.5;`
      : `
    &.GPU,
    &.MIG,
    &.MPS {
      background-color: var(--gpu-request-color);
    }

    &.CPU {
      background-color: var(--cpu-request-color);
    }

    &.MEM {
      background-color: var(--mem-request-color);
    }

    &.DISK {
      background-color: var(--disk-request-color);
    }
  `}
`;
