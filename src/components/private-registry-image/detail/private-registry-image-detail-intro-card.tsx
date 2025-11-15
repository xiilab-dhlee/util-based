"use client";

import { format } from "date-fns";
import { useParams } from "next/navigation";
import styled from "styled-components";

import { MyIcon } from "@/components/common/icons";
import { PRIVATE_REGISTRY_IMAGE_EVENTS } from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { useGetPrivateRegistryImage } from "@/hooks/private-registry-image/use-get-private-registry-image";
import { customScrollbar } from "@/styles/mixins/scrollbar";

/**
 * 내부 레지스트리 이미지 상세 페이지의 소개 카드 컴포넌트
 *
 * 이미지의 기본 정보(이름, 설명, 상태, 생성자, 생성일 등)를 표시하고,
 * 삭제 기능을 제공합니다.
 */
export function PrivateRegistryImageDetailIntroCard() {
  const { id } = useParams();
  // Pub/Sub 시스템을 통한 이벤트 발행 훅
  const publish = usePublish();

  const { data } = useGetPrivateRegistryImage(Number(id));

  /**
   * 이미지 삭제 모달을 열기 위한 핸들러
   * Pub/Sub 시스템을 통해 이미지 삭제 이벤트를 발행합니다.
   */
  const handleDelete = () => {
    publish(PRIVATE_REGISTRY_IMAGE_EVENTS.sendDeleteImage, [id]);
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>컨테이너 이미지 기본정보</HeaderTitle>
        <ToolBox>
          <IconWrapper onClick={handleDelete}>
            <MyIcon name="Delete" color="var(--icon-fill)" size={24} />
            <span className="sr-only">내부 레지스트리 이미지 삭제</span>
          </IconWrapper>
        </ToolBox>
      </Header>
      <Body>
        <Row>
          <DescriptionRowBody>
            <RowIconWrapper>
              <MyIcon name="Workspace02" color="var(--icon-fill)" size={22} />
            </RowIconWrapper>
            <RowTitle>이름</RowTitle>
          </DescriptionRowBody>
          <Description>{data?.name}</Description>
        </Row>
        <DescriptionRow>
          <DescriptionRowBody>
            <RowIconWrapper>
              <MyIcon name="Description" color="var(--icon-fill)" size={22} />
            </RowIconWrapper>
            <RowTitle>설명</RowTitle>
          </DescriptionRowBody>
          <Description>{data?.description}</Description>
        </DescriptionRow>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <MyIcon name="Info" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>상태</RowKey>
              <RowValue>{data?.status}</RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <MyIcon name="PersonFilled" color="var(--icon-fill)" size={24} />
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
              <MyIcon name="Calendar01" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>생성일 :</RowKey>
              <RowValue>
                {data?.creatorDate
                  ? format(data?.creatorDate, "yyyy.MM.dd")
                  : "-"}
              </RowValue>
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
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: 4px;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--color-border-primary);
  background-color: var(--color-bg-primary);
`;

const HeaderTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
`;

const ToolBox = styled.div`
  display: flex;
  gap: 8px;
`;

const IconWrapper = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border-primary);
  border-radius: 4px;
  background-color: var(--color-bg-primary);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-bg-hover);
  }

  &:active {
    background-color: var(--color-bg-active);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 16px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DescriptionRow = styled(Row)`
  flex: 1;
  min-height: 120px;
`;

const RowBody = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DescriptionRowBody = styled(RowBody)``;

const RowIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border-primary);
  border-radius: 4px;
  background-color: var(--color-bg-primary);

  --icon-fill: var(--color-icon-primary);
`;

const RowTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const RowKey = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-primary);
`;

const RowValue = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text-secondary);
`;

const Description = styled.div`
  padding: 12px;
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  min-height: 60px;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;

  ${customScrollbar()}
`;
