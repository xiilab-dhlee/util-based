import type { CSSProperties } from "react";
import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import type { WorkloadStatusResponseWorkloadStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getWorkloadStatusInfo } from "@/domain/workload/utils/workload.util";
import { formatNumberWithUnit } from "@/shared/utils/format.util";

interface CountByWorkloadStatusProps {
  status: WorkloadStatusResponseWorkloadStatus | "ALL";
  count: number;
  testId?: string;
  countTestId?: string;
}

/**
 * CountByWorkloadStatus 컴포넌트
 *
 * 워크로드 상태별 통계를 표시하는 컴포넌트입니다.
 * 각 상태별로 색상과 아이콘이 다르게 표시되며, 증감률과 총 개수를 보여줍니다.
 *
 * @param status - 워크로드 상태
 * @returns 워크로드 상태 통계 컴포넌트
 *
 */
export function CountByWorkloadStatus({
  status,
  count,
  testId,
  countTestId,
}: CountByWorkloadStatusProps) {
  // 상태에 따른 텍스트와 아이콘 정보 가져오기
  const { label, icon } = getWorkloadStatusInfo(status);
  const theme = getWorkloadStatusTheme(status);

  return (
    <Container key={status} style={theme} data-testid={testId}>
      <Legend variant="body-2-4">{label}</Legend>
      <DataLabel>
        <Typography.Text
          variant="subtitle-2-1"
          color="#fff"
          data-testid={countTestId}
        >
          {formatNumberWithUnit(count, "건")}
        </Typography.Text>

        <Boundary />
        <IconWrapper>
          <Icon name={icon} color="var(--icon-fill)" size={18} />
        </IconWrapper>
      </DataLabel>
    </Container>
  );
}

/**
 * 워크로드 상태 아이템의 메인 컨테이너
 *
 * 각 워크로드 상태별 통계를 표시하는 개별 아이템입니다.
 * 상태별로 다른 색상 테마를 가지며, 세로 방향으로 레이아웃이 구성됩니다.
 * 인접한 아이템과는 좌측 테두리로 구분됩니다.
 */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  height: 100%;

  /* 인접한 아이템과의 구분선 */
  & + & {
    border-left: 1px solid var(--primary-border-color);
  }

`;

/**
 * 원형 배경 경계선
 *
 * 아이템 중앙에 위치하는 원형 배경입니다.
 * 점선 테두리와 그라데이션 배경을 가지며, 상태별 색상이 적용됩니다.
 */
const Boundary = styled.div`
  position: absolute;
  top: -25px;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1px dashed var(--primary-color);
  background: var(--circle-bg-color);
`;

/**
 * 중앙 아이콘 래퍼
 *
 * 원형 배경 중앙에 위치하는 아이콘을 감싸는 컨테이너입니다.
 * 검은색 배경과 상태별 색상의 테두리를 가지며, 아이콘을 중앙에 배치합니다.
 */
const IconWrapper = styled.div`
  position: absolute;
  top: -37px;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid var(--secondary-color);
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/**
 * 상태명 범례
 *
 * 아이템 좌상단에 표시되는 상태명 텍스트입니다.
 * 텍스트 앞에 상태별 색상의 작은 원형 인디케이터가 표시됩니다.
 */
const Legend = styled(Typography.Text)`
  position: relative;
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
  color: #bdbdbd;
  margin-left: 14px;
  margin-top: 4px;

  /* 상태별 색상의 작은 원형 인디케이터 */
  &::before {
    position: absolute;
    top: 50%;
    left: -8px;
    transform: translateY(-50%);
    border-radius: 50%;
    content: "";
    width: 4px;
    height: 4px;
    background-color: var(--primary-color);
  }
`;

/**
 * 데이터 라벨 컨테이너
 *
 * 아이템 하단에 표시되는 총 개수와 증감률을 포함하는 컨테이너입니다.
 * 중앙 정렬되어 표시되며, 하단 패딩을 통해 적절한 여백을 제공합니다.
 */
const DataLabel = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding-bottom: 14px;
  position: relative;
`;

type WorkloadStatusTheme = CSSProperties & {
  "--primary-color": string;
  "--secondary-color": string;
  "--icon-fill": string;
  "--circle-bg-color": string;
};

const WORKLOAD_STATUS_THEME_MAP: Record<
  CountByWorkloadStatusProps["status"],
  WorkloadStatusTheme
> = {
  ALL: {
    "--primary-color": "#d77bff",
    "--secondary-color": "#ae8dff7a",
    "--icon-fill": "#d77bff",
    "--circle-bg-color": "linear-gradient(180deg, #ae8dff66 0%, #171b2600 15%)",
  },
  RUNNING: {
    "--primary-color": "#86b6ff",
    "--secondary-color": "#86b6ff7a",
    "--icon-fill": "#86b6ff",
    "--circle-bg-color": "linear-gradient(180deg, #86b6ff66 0%, #171b2600 15%)",
  },
  PENDING: {
    "--primary-color": "#52bc4a",
    "--secondary-color": "#bababa7a",
    "--icon-fill": "#4f9838",
    "--circle-bg-color": "linear-gradient(180deg, #6ecf2d57 0%, #1b261700 15%)",
  },
  TERMINATED: {
    "--primary-color": "#bdbdbd",
    "--secondary-color": "#bababa66",
    "--icon-fill": "#a3afd0",
    "--circle-bg-color": "linear-gradient(180deg, #c3c3c366 0%, #171b2600 15%)",
  },
  ERROR: {
    "--primary-color": "#ff8080",
    "--secondary-color": "#ff80807a",
    "--icon-fill": "#ff8080",
    "--circle-bg-color": "linear-gradient(180deg, #ff808066 0%, #171b2600 15%)",
  },
  CREATING: {
    "--primary-color": "#52bc4a",
    "--secondary-color": "#bababa7a",
    "--icon-fill": "#4f9838",
    "--circle-bg-color": "linear-gradient(180deg, #6ecf2d57 0%, #1b261700 15%)",
  },
  TERMINATING: {
    "--primary-color": "#ffb35c",
    "--secondary-color": "#ffb35c7a",
    "--icon-fill": "#ffb35c",
    "--circle-bg-color": "linear-gradient(180deg, #ffb35c66 0%, #171b2600 15%)",
  },
};

const getWorkloadStatusTheme = (
  status: CountByWorkloadStatusProps["status"],
): WorkloadStatusTheme =>
  WORKLOAD_STATUS_THEME_MAP[status] ?? WORKLOAD_STATUS_THEME_MAP.ALL;
