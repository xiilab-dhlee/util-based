"use client";

import styled from "styled-components";

import type { WorkspaceDetailResourceResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { convertBytes, getResourceInfo } from "@/shared/utils/resource.util";

/**
 * 워크스페이스 리소스 사용량 카드 컴포넌트
 *
 * 워크스페이스의 리소스 사용량 정보를 표시합니다.
 * GPU, CPU, MEM의 요청량, 사용량, 할당량을 테이블 형태로 보여줍니다.
 */
interface WorkspaceResourceUsageCardProps {
  resource?: WorkspaceDetailResourceResponse;
}

export function WorkspaceResourceUsageCard({
  resource,
}: WorkspaceResourceUsageCardProps) {
  const gpuUnit = getResourceInfo("GPU").unit;
  const cpuUnit = getResourceInfo("CPU").unit;
  const memUnit = getResourceInfo("MEM").unit;

  const gpuRequest = resource?.gpu.requestCount ?? 0;
  const gpuUsed = resource?.gpu.usedCount ?? 0;
  const gpuQuota = resource?.gpu.quotaCount ?? 0;

  const cpuRequest = resource?.cpu.requestCore ?? 0;
  const cpuUsed = resource?.cpu.usedCore ?? 0;
  const cpuQuota = resource?.cpu.quotaCore ?? 0;

  const memoryRequest = convertBytes(
    resource?.memory.requestByte ?? 0,
    "GB",
    0,
  ).value;
  const memoryUsed = convertBytes(
    resource?.memory.usedByte ?? 0,
    "GB",
    0,
  ).value;
  const memoryQuota = convertBytes(
    resource?.memory.quotaByte ?? 0,
    "GB",
    0,
  ).value;

  return (
    <>
      {/* 리소스 사용량 카드 컨테이너 */}
      <Container>
        {/* 카드 제목 */}
        <Title>리소스 사용량</Title>

        {/* 리소스 사용량 테이블 */}
        <Ul>
          {/* 테이블 헤더 행 */}
          <HeaderLi>
            <CategoryColumn className="header">
              <HeaderText>리소스</HeaderText>
            </CategoryColumn>
            <Column>
              <HeaderText>요청량</HeaderText>
            </Column>
            <Column>
              <HeaderText>사용량</HeaderText>
            </Column>
            <Column>
              <HeaderText>할당량</HeaderText>
            </Column>
          </HeaderLi>

          {/* GPU 리소스 정보 행 */}
          <Li>
            <CategoryColumn className="gpu">
              <Key>GPU</Key>
            </CategoryColumn>
            <Column>
              <Value>{`${gpuRequest}${gpuUnit}`}</Value>
            </Column>
            <Column>
              <Value>{`${gpuUsed}${gpuUnit}`}</Value>
            </Column>
            <Column>
              <Value>{`${gpuQuota}${gpuUnit}`}</Value>
            </Column>
          </Li>

          {/* CPU 리소스 정보 행 */}
          <Li>
            <CategoryColumn className="cpu">
              <Key>CPU</Key>
            </CategoryColumn>
            <Column>
              <Value>{`${cpuRequest}${cpuUnit}`}</Value>
            </Column>
            <Column>
              <Value>{`${cpuUsed}${cpuUnit}`}</Value>
            </Column>
            <Column>
              <Value>{`${cpuQuota}${cpuUnit}`}</Value>
            </Column>
          </Li>

          {/* MEM 리소스 정보 행 */}
          <Li>
            <CategoryColumn className="mem">
              <Key>MEM</Key>
            </CategoryColumn>
            <Column>
              <Value>{`${memoryRequest}${memUnit}`}</Value>
            </Column>
            <Column>
              <Value>{`${memoryUsed}${memUnit}`}</Value>
            </Column>
            <Column>
              <Value>{`${memoryQuota}${memUnit}`}</Value>
            </Column>
          </Li>
        </Ul>
      </Container>
    </>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

/**
 * 리소스 사용량 카드 메인 컨테이너
 * 카드의 전체 레이아웃과 스타일을 정의합니다.
 */
const Container = styled.div`
  width: 100%;
  height: 166px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  padding-top: 1px;
  background-color: #fcfcfc;
  padding: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);

  --border-color: #e0e0e0;
`;

/**
 * 카드 제목 스타일
 * "리소스 사용량" 텍스트의 스타일을 정의합니다.
 */
const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
  height: 16px;
`;

/**
 * 리소스 테이블 컨테이너
 * 테이블의 세로 레이아웃을 정의합니다.
 */
const Ul = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

/**
 * 테이블 행 기본 스타일
 * 각 리소스 행의 공통 스타일을 정의합니다.
 */
const Li = styled.li`
  border: 1px solid var(--border-color);
  background-color: #fcfcfc;
  border-radius: 2px;
  height: 24px;
  flex: 1;
  display: flex;
  overflow: hidden;
`;

/**
 * 테이블 헤더 행 스타일
 * 헤더 행의 배경색을 정의합니다.
 */
const HeaderLi = styled(Li)`
  background-color: #f3f5f7;
`;

/**
 * 테이블 컬럼 스타일
 * 각 데이터 컬럼의 레이아웃을 정의합니다.
 */
const Column = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  & + & {
    border-left: 1px solid var(--border-color);
    margin: 4px 0;
  }
`;

/**
 * 리소스 카테고리 컬럼 스타일
 * GPU, CPU, MEM 카테고리별 배경색을 정의합니다.
 */
const CategoryColumn = styled.div`
  flex-basis: 52px;
  background-color: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid var(--border-color);

  &.header {
    margin: 4px 0;
  }

  &.gpu {
    --bg-color: #f2ebfa;
  }

  &.cpu {
    --bg-color: #eaf1fa;
  }

  &.mem {
    --bg-color: #e9f6f0;
  }
`;

/**
 * 헤더 텍스트 스타일
 * 테이블 헤더의 텍스트 스타일을 정의합니다.
 */
const HeaderText = styled.span`
  font-weight: 500;
  font-size: 11px;
  color: #555555;
`;

/**
 * 리소스 키 텍스트 스타일
 * GPU, CPU, MEM 키의 텍스트 스타일을 정의합니다.
 */
const Key = styled.span`
  font-family: Pretendard;
  font-weight: 600;
  font-size: 12px;
  color: #000;
`;

/**
 * 리소스 값 텍스트 스타일
 * 요청량, 사용량, 할당량 값의 텍스트 스타일을 정의합니다.
 */
const Value = styled.span`
  font-weight: 400;
  font-size: 12px;
  text-align: center;
  color: #070913;
`;
