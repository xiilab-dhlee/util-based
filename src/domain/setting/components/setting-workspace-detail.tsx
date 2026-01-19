import { useAtomValue } from "jotai";
import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import { useGetWorkspaceDetail } from "@/api/generated/workspace/workspace";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { formatDateSafely } from "@/shared/utils/date.util";
import { customScrollbar } from "@/styles/mixins/scrollbar";

export function SettingWorkspaceDetail() {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  const { data, isError } = useGetWorkspaceDetail(
    selectedWorkspace?.workspaceId ?? 0,
    {
      query: {
        enabled: Boolean(selectedWorkspace?.workspaceId),
      },
    },
  );

  if (isError) {
    return (
      <Container>
        <Header>
          <Title>상세 정보</Title>
        </Header>
        <Body className="error-body">
          <DataErrorState darkMode />
        </Body>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>상세 정보</Title>
      </Header>
      <Body>
        <Row>
          <DescriptionRowBody>
            <RowIconWrapper>
              <Icon name="Workspace01" color="var(--icon-fill)" size={18} />
            </RowIconWrapper>
            <RowTitle>워크스페이스 이름</RowTitle>
          </DescriptionRowBody>
          <Description>{data?.workspaceName ?? "-"}</Description>
        </Row>
        <DescriptionRow>
          <DescriptionRowBody>
            <RowIconWrapper>
              <Icon name="Description" color="var(--icon-fill)" size={18} />
            </RowIconWrapper>
            <RowTitle>워크스페이스 설명</RowTitle>
          </DescriptionRowBody>
          <Description>{data?.description ?? "-"}</Description>
        </DescriptionRow>
        <Row>
          <KeyValueRowBody>
            <RowIconWrapper>
              <Icon name="Person" color="var(--icon-fill)" size={18} />
            </RowIconWrapper>
            <KeyValueRowTitle>
              <RowKey>생성자 :</RowKey>
              <RowValue>{data?.creatorName ?? "-"}</RowValue>
            </KeyValueRowTitle>
          </KeyValueRowBody>
        </Row>
        <Row>
          <KeyValueRowBody>
            <RowIconWrapper>
              <Icon name="Calendar01" color="var(--icon-fill)" size={18} />
            </RowIconWrapper>
            <KeyValueRowTitle>
              <RowKey>생성일 :</RowKey>
              <RowValue>
                {formatDateSafely(data?.createdAt, "yyyy.MM.dd", "-")}
              </RowValue>
            </KeyValueRowTitle>
          </KeyValueRowBody>
        </Row>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  background: #171b26;
  border-radius: 8px;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  width: 310px;
  height: 362px;
  overflow: hidden;
`;

const Header = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 16px;
`;
const Title = styled(Typography.Text).attrs({
  variant: "subtitle-2", // 16px variant
})`
  color: #f5f5f5;
  margin: 0;
  font-weight: 700; // Keep 700 weight
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;

  ${customScrollbar("#2A3041")}

  &.error-body{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }
`;
/**
 * 정보 행 기본 스타일
 * 각 정보 섹션(상태, 라벨)을 위한 공통 스타일
 */
const Row = styled.div`
  display: flex;
  flex-direction: column;
  background: #070913;
  border: 1px solid #2a3041;
  padding: 8px 10px;
  border-radius: 4px;
`;

/**
 * 설명 정보 행
 * 확장 가능한 높이를 가진 설명 전용 행
 */
const DescriptionRow = styled(Row)`
  min-height: 124px;
`;

/**
 * 행 본문 영역
 * 아이콘과 제목을 포함하는 상단 영역
 */
const RowBody = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 700;
  font-size: 12px;
  color: #f5f5f5;
`;

/**
 * 설명 행 본문 영역
 * 하단 여백이 추가된 설명 전용 본문
 */
const DescriptionRowBody = styled(RowBody)`
  margin-bottom: 6px;
`;

/**
 * 행 제목 영역
 * 각 정보 섹션의 제목을 표시
 */
const RowTitle = styled.div`
  min-height: 24px;
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 4px;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

const KeyValueRowBody = styled(RowBody)`
  align-items: flex-start;
`;

const KeyValueRowTitle = styled(RowTitle)`
  align-items: start;
  padding-top: 4px;
`;
const RowKey = styled.span`
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: #f5f5f5;
  white-space: nowrap;
`;

/**
 * 행 아이콘 래퍼
 * 각 정보 행의 아이콘을 위한 스타일링
 */
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

/**
 * 워크스페이스 설명 텍스트
 * 긴 설명에 대한 스크롤 처리
 */
const Description = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #cbcbcb;
  overflow-wrap: anywhere;
  word-break: break-word;
`;

const RowValue = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #cacaca;
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
`;
