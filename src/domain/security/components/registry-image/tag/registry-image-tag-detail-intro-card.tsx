"use client";

import { useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { Icon, Label } from "xiilab-ui";

import { RegistryImageTagSecurityCard } from "@/domain/security/components/registry-image/tag/registry-image-tag-security-card";
import { useGetRegistrySecurityTag } from "@/domain/security/hooks/use-get-registry-security-tag";
import { VULNERABILITY_LEVEL_KEY_TO_CORE_LEVEL } from "@/shared/constants/vulnerability.constant";
import { formatDateTimeSafely } from "@/shared/utils/date.util";

/**
 * 레지스트리 이미지 상세 페이지의 소개 카드 컴포넌트
 *
 * 이미지의 기본 정보(이름, 설명, 상태, 생성자, 생성일 등)를 표시하고,
 * 삭제 기능을 제공합니다.
 */
export function RegistryImageTagDetailIntroCard() {
  const { tagId } = useParams();
  const searchParams = useSearchParams();
  const imageId = searchParams.get("imageId");

  const { data } = useGetRegistrySecurityTag({
    imageId: Number(imageId),
    tagId: Number(tagId),
  });

  return (
    <Container>
      <Header>
        <HeaderTitle>{data?.imageTagName}</HeaderTitle>
      </Header>
      <Body>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="Info" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>보안 검사 상태 :</RowKey>
              <RowValue>
                <Label variant="blue" theme="dark">
                  완료
                </Label>
              </RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="Person" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>생성자 :</RowKey>
              <RowValue>{data?.creatorName ?? "-"}</RowValue>
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
              <RowValue>{formatDateTimeSafely(data?.createDateTime)}</RowValue>
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
              <RowValue>{data?.imageTagSizeByte ?? "-"}</RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <SecurityRow>
          <SecurityHeader>
            <HeaderTitle>취약점 심각도 현황</HeaderTitle>
          </SecurityHeader>
          <SecurityBody>
            <RegistryImageTagSecurityCard
              level={VULNERABILITY_LEVEL_KEY_TO_CORE_LEVEL.critical}
              count={data?.vulnerability?.criticalCount ?? 0}
            />
            <RegistryImageTagSecurityCard
              level={VULNERABILITY_LEVEL_KEY_TO_CORE_LEVEL.high}
              count={data?.vulnerability?.highCount ?? 0}
            />
            <RegistryImageTagSecurityCard
              level={VULNERABILITY_LEVEL_KEY_TO_CORE_LEVEL.medium}
              count={data?.vulnerability?.mediumCount ?? 0}
            />
            <RegistryImageTagSecurityCard
              level={VULNERABILITY_LEVEL_KEY_TO_CORE_LEVEL.low}
              count={data?.vulnerability?.lowCount ?? 0}
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
