"use client";

import styled from "styled-components";
import { Icon } from "xiilab-ui";

/**
 * 리소스 요청 목록 페이지의 소개 카드 컴포넌트
 *
 * 리소스 요청 기능과 리소스 사용량/할당량 개념을 안내하는 정적 정보 카드입니다.
 * 워크스페이스 Intro 카드와 유사한 레이아웃을 사용합니다.
 */
export function RequestResourceIntroCard() {
  return (
    <Container>
      <Header>
        <HeaderTitle>리소스 요청 안내</HeaderTitle>
      </Header>
      <Body>
        <Row>
          <DescriptionRowBody>
            <RowIconWrapper>
              <Icon name="Workspace01" color="var(--icon-fill)" size={22} />
            </RowIconWrapper>
            <RowTitle>리소스 요청 관리</RowTitle>
          </DescriptionRowBody>
          <Description>
            각 리소스의 실제 사용량과 전체 할당량 대비 사용을 확인하고,
            워크스페이스 별 리소스 요청을 승인 및 반려하세요.
          </Description>
        </Row>
        <Divider />
        <DescriptionRow>
          <DescriptionRowBody>
            <RowIconWrapper>
              <Icon name="Description" color="var(--icon-fill)" size={22} />
            </RowIconWrapper>
            <RowTitle>리소스 요청 목록 · 리소스 사용량 및 할당량</RowTitle>
          </DescriptionRowBody>
          <Description>
            시스템 내 전체 GPU, CPU, Memory 등의 사용량과 할당 현황을
            <br />
            확인할 수 있습니다.
          </Description>

          <Divider />

          <Description>
            시스템 전체 GPU, CPU, 메모리 등 주요 리소스의 사용 현황과 잔여
            <br />
            용량을 실시간으로 확인할 수 있습니다.
          </Description>
        </DescriptionRow>
      </Body>
    </Container>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const Container = styled.div`
  width: 100%;
  max-height: 490px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding-top: 14px;
  background-color: #171b26;
  padding: 24px;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin: 10px 0;
  background-color: #2a3041;
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

const DescriptionRow = styled(Row)`
  flex: 1;
`;

const RowBodyBase = styled.div`
  display: flex;
  justify-content: flex-start;
  font-weight: 700;
  font-size: 12px;
  color: #f5f5f5;
`;

const DescriptionRowBody = styled(RowBodyBase)`
  margin-bottom: 6px;
`;

const RowTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
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

const RowIconWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #343c50;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  margin-right: 8px;

  --icon-fill: #e8eaed;
`;

const Description = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #cbcbcb;
`;
