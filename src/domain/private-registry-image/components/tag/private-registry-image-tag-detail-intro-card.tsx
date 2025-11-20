"use client";

import { format } from "date-fns";
import { useParams } from "next/navigation";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { useGetPrivateRegistryImageTag } from "@/domain/private-registry-image/hooks/use-get-private-registry-image-tag";
import { PRIVATE_REGISTRY_IMAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { PrivateRegistryImageTagSecurityCard } from "./private-registry-image-tag-security-card";

/**
 * 내부 레지스트리 이미지 상세 페이지의 소개 카드 컴포넌트
 *
 * 이미지의 기본 정보(이름, 설명, 상태, 생성자, 생성일 등)를 표시하고,
 * 삭제 기능을 제공합니다.
 */
export function PrivateRegistryImageTagDetailIntroCard() {
  const { id, tagId } = useParams();
  // Pub/Sub 시스템을 통한 이벤트 발행 훅
  const publish = usePublish();

  const { data } = useGetPrivateRegistryImageTag({
    imageId: Number(id),
    tagId: Number(tagId),
  });

  /**
   * 이미지 삭제 모달을 열기 위한 핸들러
   * Pub/Sub 시스템을 통해 이미지 삭제 이벤트를 발행합니다.
   */
  const handleDelete = () => {
    publish(PRIVATE_REGISTRY_IMAGE_EVENTS.sendDeleteImageTag, [Number(tagId)]);
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>{data?.tag}</HeaderTitle>
        <ToolBox>
          <IconWrapper onClick={handleDelete}>
            <Icon name="Delete" color="var(--icon-fill)" size={24} />
            <span className="sr-only">내부 레지스트리 이미지 태그 삭제</span>
          </IconWrapper>
        </ToolBox>
      </Header>
      <Body>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="PersonFilled" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>생성자</RowKey>
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
              <RowKey>생성일</RowKey>
              <RowValue>
                {data?.creatorDate
                  ? format(data?.creatorDate, "yyyy.MM.dd")
                  : "-"}
              </RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="Size02" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>크기</RowKey>
              <RowValue>{data?.imageSize}</RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <SecurityRow>
          <SecurityHeader>
            <HeaderTitle>취약점 심각도 현황</HeaderTitle>
          </SecurityHeader>
          <SecurityBody>
            <PrivateRegistryImageTagSecurityCard
              level="CRITICAL"
              count={data?.critical || 0}
            />
            <PrivateRegistryImageTagSecurityCard
              level="HIGH"
              count={data?.high || 0}
            />
            <PrivateRegistryImageTagSecurityCard
              level="MEDIUM"
              count={data?.medium || 0}
            />
            <PrivateRegistryImageTagSecurityCard
              level="LOW"
              count={data?.low || 0}
            />
          </SecurityBody>
        </SecurityRow>
      </Body>
    </Container>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

/**
 * 워크스페이스 소개 카드 메인 컨테이너
 * 고정 높이와 스크롤 처리를 위한 스타일링
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
 * 카드 헤더 영역
 * 워크스페이스 이름과 도구 버튼들을 좌우로 배치
 */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
`;

/**
 * 카드 본문 영역
 * 워크스페이스 상세 정보들을 세로로 배치
 */
const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
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
 * 워크스페이스 이름 표시 영역
 * 긴 이름에 대한 텍스트 자르기 처리
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
 * 도구 버튼 컨테이너
 * 수정, 전원 제어 등의 액션 버튼들을 배치
 */
const ToolBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
`;

/**
 * 아이콘 버튼 래퍼
 * 헤더의 액션 버튼들을 위한 스타일링
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

const RowValue = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #cacaca;
`;

const SecurityRow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const SecurityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
`;

const SecurityBody = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
`;
