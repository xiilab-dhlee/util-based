import { format } from "date-fns";
import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import { useGetWorkspace } from "@/domain/workspace/hooks/use-get-workspace";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { customScrollbar } from "@/styles/mixins/scrollbar";

export function SettingWorkspaceDetail() {
  const publish = usePublish();

  const { data } = useGetWorkspace("test-workspace");

  const handleUpdateWorkspace = () => {
    publish(WORKSPACE_EVENTS.sendUpdateWorkspace, {
      id: data?.id,
      name: data?.name,
      description: data?.description,
    });
  };

  const handleDeleteWorkspace = () => {
    publish(WORKSPACE_EVENTS.sendDeleteWorkspace, [data?.id]);
  };

  return (
    <Container>
      <Header>
        <Title>상세 정보</Title>
        <Tools>
          <StyledButton onClick={handleUpdateWorkspace}>
            <Icon name="Edit02" color="#CED5DB" size={20} />
          </StyledButton>
          <StyledButton onClick={handleDeleteWorkspace}>
            <Icon name="Delete" color="#CED5DB" size={20} />
          </StyledButton>
        </Tools>
      </Header>
      <Body>
        <Row>
          <DescriptionRowBody>
            <RowIconWrapper>
              <Icon name="Description" color="var(--icon-fill)" size={22} />
            </RowIconWrapper>
            <RowTitle>워크스페이스 이름</RowTitle>
          </DescriptionRowBody>
          <Description>{data?.name}</Description>
        </Row>
        <DescriptionRow>
          <DescriptionRowBody>
            <RowIconWrapper>
              <Icon name="Description" color="var(--icon-fill)" size={22} />
            </RowIconWrapper>
            <RowTitle>워크스페이스 설명</RowTitle>
          </DescriptionRowBody>
          <Description>{data?.description}</Description>
        </DescriptionRow>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="PersonFilled" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>생성자 :</RowKey>
              <RowValue>{data?.creatorName}</RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="Calendar01" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>생성일 :</RowKey>
              <RowValue>
                {data?.creatorDate
                  ? format(data.creatorDate, "yyyy.MM.dd")
                  : "-"}
              </RowValue>
            </RowTitle>
          </RowBody>
        </Row>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  background: #171b26;
  border-radius: 8px;
  padding: 14px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  width: 310px;
  height: 370px;
  overflow: hidden;
`;

const Header = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 8px;
`;
const Title = styled(Typography.Text).attrs({
  variant: "subtitle-2", // 16px variant
})`
  color: #f5f5f5;
  margin: 0;
  font-weight: 700; // Keep 700 weight
`;
const Tools = styled.div`
  display: flex;
  gap: 8px;
`;

const StyledButton = styled.button`
  width: 30px;
  height: 30px;
  background: #171b26;
  border: 1px solid #343c50;
  border-radius: 2px;
  color: #ced5db;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow:
    0px 2px 4px 0px rgba(8, 10, 15, 1),
    inset 0px 2px 4px -1px rgba(8, 10, 15, 1);
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  overflow: hidden;
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
  overflow: hidden;
`;

/**
 * 설명 정보 행
 * 확장 가능한 높이를 가진 설명 전용 행
 */
const DescriptionRow = styled(Row)`
  flex: 1;
`;

/**
 * 행 본문 영역
 * 아이콘과 제목을 포함하는 상단 영역
 */
const RowBody = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
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
  display: inline-block;
  height: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

/**
 * 워크로드 상태 제목
 * 상태 섹션의 제목을 표시 (우측 여백 추가)
 */
const RowKey = styled.span`
  margin-right: 4px;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: #f5f5f5;
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
  overflow-y: auto;
  flex: 1;

  ${customScrollbar("#2A3041")}
`;

const RowValue = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #cacaca;
`;
