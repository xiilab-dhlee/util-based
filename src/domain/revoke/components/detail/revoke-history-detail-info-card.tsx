"use client";

import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { ChangeCircleIcon } from "@/shared/components/icon/change-circle-icon";
import { getResourceInfo } from "@/shared/utils/resource.util";

const GPU_RESOURCE_INFO = getResourceInfo("GPU");
const CPU_RESOURCE_INFO = getResourceInfo("CPU");
const MEM_RESOURCE_INFO = getResourceInfo("MEM");

/**
 * 리소스 회수 이력 상세 정보 카드 컴포넌트
 *
 * 사이드바에 표시되는 회수 이력의 기본 정보를 표시합니다.
 * 추후 별도 API 연동 예정
 */
export function RevokeHistoryDetailInfoCard() {
  // TODO: 별도 API 연동 후 데이터 표시
  return (
    <Container>
      <Header>
        <HeaderTitle>리소스 회수 이력 상세 정보</HeaderTitle>
      </Header>
      <Body>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="Calendar01" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>스캔일시 :</RowKey>
              <RowValue>-</RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="Shield" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>검사 대상 개수 :</RowKey>
              <RowValue>-개</RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="Error" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>경고 워크로드 개수 :</RowKey>
              <RowValue>-개</RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <ChangeCircleIcon
                fill="var(--icon-fill)"
                width={24}
                height={24}
              />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>회수 워크로드 개수 :</RowKey>
              <RowValue>-개</RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <Row>
          <RowBody>
            <RowIconWrapper $fillColor="var(--icon-fill)">
              {GPU_RESOURCE_INFO.icon ? (
                <Icon
                  name={GPU_RESOURCE_INFO.icon}
                  color="var(--icon-fill)"
                  size={22}
                />
              ) : null}
            </RowIconWrapper>
            <RowTitle>
              <RowKey>회수된 GPU :</RowKey>
              <RowValue>{`- ${GPU_RESOURCE_INFO.unit}`}</RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <Row>
          <RowBody>
            <RowIconWrapper $fillColor="var(--icon-fill)">
              {CPU_RESOURCE_INFO.icon ? (
                <Icon
                  name={CPU_RESOURCE_INFO.icon}
                  color="var(--icon-fill)"
                  size={22}
                />
              ) : null}
            </RowIconWrapper>
            <RowTitle>
              <RowKey>회수된 CPU :</RowKey>
              <RowValue>{`- ${CPU_RESOURCE_INFO.unit}`}</RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <Row>
          <RowBody>
            <RowIconWrapper $fillColor="var(--icon-fill)">
              {MEM_RESOURCE_INFO.icon ? (
                <Icon
                  name={MEM_RESOURCE_INFO.icon}
                  color="var(--icon-fill)"
                  size={22}
                />
              ) : null}
            </RowIconWrapper>
            <RowTitle>
              <RowKey>회수된 Memory :</RowKey>
              <RowValue>- GB</RowValue>
            </RowTitle>
          </RowBody>
        </Row>
      </Body>
    </Container>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const Container = styled.div`
  width: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: #171b26;
  padding: 24px;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  margin-bottom: 12px;
`;

const HeaderTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  color: #f5f5f5;
  flex: 1;
  overflow: hidden;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  background: #070913;
  border: 1px solid #2a3041;
  padding: 8px 10px;
  border-radius: 4px;
  overflow: hidden;
`;

const RowBody = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-weight: 700;
  font-size: 12px;
  color: #f5f5f5;
`;

const RowTitle = styled.div`
  height: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const RowKey = styled.span`
  margin-right: 4px;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: #f5f5f5;
`;

const RowValue = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #cacaca;
`;

const RowIconWrapper = styled.span<{ $fillColor?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #343c50;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  margin-right: 8px;

  --icon-fill: ${({ $fillColor }) => $fillColor ?? "#e8eaed"};
`;
