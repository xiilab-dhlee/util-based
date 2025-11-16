"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";

import { MyIcon } from "@/components/common/icon";
import { WORKSPACE_EVENTS } from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { useGetWorkspace } from "@/hooks/workspace/use-get-workspace";
import { customScrollbar } from "@/styles/mixins/scrollbar";

/**
 * ?�크?�페?�스 ?�세 ?�이지???�개 카드 컴포?�트
 *
 * ?�크?�페?�스??기본 ?�보(?�름, ?�명, ?�성?? ?�성?? GPU ??�??�시?�고,
 * ??�� 기능???�공?�니??
 */
export function WorkspaceIntroCard() {
  const { id } = useParams();
  // Pub/Sub ?�스?�을 ?�한 ?�벤??발행 ??
  const publish = usePublish();

  const { data } = useGetWorkspace(id as string);

  /**
   * ?�크?�페?�스 ??�� 모달???�기 ?�한 ?�들??
   * Pub/Sub ?�스?�을 ?�해 ?�크?�페?�스 ??�� ?�벤?��? 발행?�니??
   */
  const handleDelete = () => {
    publish(WORKSPACE_EVENTS.sendDeleteWorkspace, [id]);
  };

  return (
    <>
      {/* ?�크?�페?�스 ?�개 카드 메인 컨테?�너 */}
      <Container>
        {/* ?�더 ?�역: ?�크?�페?�스 ?�름�??�구 버튼??*/}
        <Header>
          {/* ?�크?�페?�스 ?�름 ?�시 ?�역 */}
          <HeaderTitle>?�크?�페?�스 기본?�보</HeaderTitle>
          {/* ?�구 버튼 ?�역 */}
          <ToolBox>
            {/* ?�크?�페?�스 ??�� 버튼 */}
            <IconWrapper onClick={handleDelete}>
              <MyIcon name="Delete" color="var(--icon-fill)" size={24} />
              <span className="sr-only">?�크?�페?�스 ??��</span>
            </IconWrapper>
          </ToolBox>
        </Header>

        {/* 본문 ?�역: ?�크?�페?�스 ?�세 ?�보 */}
        <Body>
          {/* ?�크로드 ?�태 ?�보 ??*/}
          {/* <Row>
            <RowBody>
              <RowIconWrapper>
                <MyIcon name="Info" color="var(--icon-fill)" size={24} />
              </RowIconWrapper>
              <RowTitle>
                <RowKey>?�크로드 ?�태</RowKey>
                <WorkloadStatusText status={status} />
              </RowTitle>
            </RowBody>
          </Row> */}
          {/* ?�크로드 ?�명 ?�보 ??(?�장 가?? */}
          <Row>
            <DescriptionRowBody>
              <RowIconWrapper>
                <MyIcon name="Description" color="var(--icon-fill)" size={22} />
              </RowIconWrapper>
              <RowTitle>?�름</RowTitle>
            </DescriptionRowBody>
            {/* ?�크로드 ?�명 ?�스??(?�크�?가?? */}
            <Description>{data?.workspace.name}</Description>
          </Row>

          {/* ?�크로드 ?�명 ?�보 ??(?�장 가?? */}
          <DescriptionRow>
            <DescriptionRowBody>
              <RowIconWrapper>
                <MyIcon name="Description" color="var(--icon-fill)" size={22} />
              </RowIconWrapper>
              <RowTitle>?�크로드 ?�명</RowTitle>
            </DescriptionRowBody>
            {/* ?�크로드 ?�명 ?�스??(?�크�?가?? */}
            <Description>{data?.workspace.description}</Description>
          </DescriptionRow>
          <Row>
            <RowBody>
              <RowIconWrapper>
                <MyIcon
                  name="PersonFilled"
                  color="var(--icon-fill)"
                  size={24}
                />
              </RowIconWrapper>
              <RowTitle>
                <RowKey>?�성??:</RowKey>
                <RowValue>{data?.workspace.createUserName}</RowValue>
              </RowTitle>
            </RowBody>
          </Row>
          <Row>
            <RowBody>
              <RowIconWrapper>
                <MyIcon name="Calendar01" color="var(--icon-fill)" size={24} />
              </RowIconWrapper>
              <RowTitle>
                <RowKey>?�성??:</RowKey>
                <RowValue>{data?.workspace.createUserName}</RowValue>
              </RowTitle>
            </RowBody>
          </Row>
          <Row>
            <RowBody>
              <RowIconWrapper>
                <MyIcon name="Gpu" color="var(--icon-fill)" size={24} />
              </RowIconWrapper>
              <RowTitle>
                <RowKey>GPU :</RowKey>
                <RowValue>{data?.workspace.createUserName}</RowValue>
              </RowTitle>
            </RowBody>
          </Row>
        </Body>
      </Container>
    </>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

/**
 * ?�크?�페?�스 ?�개 카드 메인 컨테?�너
 * 고정 ?�이?� ?�크�?처리�??�한 ?��??�링
 */
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

/**
 * 카드 ?�더 ?�역
 * ?�크?�페?�스 ?�름�??�구 버튼?�을 좌우�?배치
 */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
`;

/**
 * 카드 본문 ?�역
 * ?�크?�페?�스 ?�세 ?�보?�을 ?�로�?배치
 */
const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
`;

/**
 * ?�보 ??기본 ?��???
 * �??�보 ?�션(?�태, ?�벨)???�한 공통 ?��???
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
 * ?�명 ?�보 ??
 * ?�장 가?�한 ?�이�?가�??�명 ?�용 ??
 */
const DescriptionRow = styled(Row)`
  flex: 1;
`;

/**
 * ??본문 ?�역
 * ?�이콘과 ?�목???�함?�는 ?�단 ?�역
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
 * ?�명 ??본문 ?�역
 * ?�단 ?�백??추�????�명 ?�용 본문
 */
const DescriptionRowBody = styled(RowBody)`
  margin-bottom: 6px;
`;

/**
 * ???�목 ?�역
 * �??�보 ?�션???�목???�시
 */
const RowTitle = styled.div`
  display: inline-block;
  height: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

/**
 * ?�크로드 ?�태 ?�목
 * ?�태 ?�션???�목???�시 (?�측 ?�백 추�?)
 */
const RowKey = styled.span`
  margin-right: 4px;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: #f5f5f5;
`;

/**
 * ?�크?�페?�스 ?�름 ?�시 ?�역
 * �??�름???�???�스???�르�?처리
 */
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

/**
 * ?�구 버튼 컨테?�너
 * ?�정, ?�원 ?�어 ?�의 ?�션 버튼?�을 배치
 */
const ToolBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
`;

/**
 * ?�이�?버튼 ?�퍼
 * ?�더???�션 버튼?�을 ?�한 ?��??�링
 */
const IconWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #343c50;
  width: 30px;
  height: 30px;
  border-radius: 2px;
  background-color: transparent;

  --icon-fill: #ced5db;
`;

/**
 * ???�이�??�퍼
 * �??�보 ?�의 ?�이콘을 ?�한 ?��??�링
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
 * ?�크?�페?�스 ?�명 ?�스??
 * �??�명???�???�크�?처리
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
