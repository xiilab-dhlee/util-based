"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import { AsideFillCard } from "@/layouts/aside/aside-fill-card";
import EditDescriptionModal from "../modal/edit-description-modal";
import PrivateRegistryValidationCard from "./private-registry-validation-card";

interface PrivateRegistryDetailAsideProps {
  /** 현재 이미지 ID */
  imageId: string;
}

/**
 * 내부 레지스트리 상세 페이지 좌측 영역 컴포넌트
 *
 * 컨테이너 이미지 기본 정보와 검증 진행중인 목록을 포함합니다.
 */
export function PrivateRegistryDetailAside({}: PrivateRegistryDetailAsideProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [description, setDescription] = useState(
    `Dev Snapshot -V1.2 이미지는 Mosquitto MQTT 브로커를 포함
하는 Docker 이미지입니다. 이 이미지는 x86_64(amd64) 아키텍처 
기반 시스템에서 실행되도록 설계되었습니다. 해당 컨테이너 이미지는 
업로드 완료 된 상태이며 태그는 V1.2까지 생성되었습니다. V4의 경우 
검증 실패 상태였지만 관리자의 승인 요청을 통해서 사용 가능하도록 
수정되었습니다. 취약점이 존재하지만 사용하도록 승인을 한 경우이니 
사용자는 유의하여 해당 이미지를 사용하시길 바랍니다.`,
  );

  const handleEditDescription = (newDescription: string) => {
    setDescription(newDescription);
  };

  return (
    <Container>
      {/* 컨테이너 이미지 기본정보 */}
      <ImageInfoCard>
        <CardTitle>컨테이너 이미지 기본정보</CardTitle>

        <EditButton onClick={() => setIsEditModalOpen(true)}>
          <Icon name="Edit02" size={24} color="#E8EAED" />
        </EditButton>

        {/* 이름 */}
        <InfoSectionColumn top="52px" height="70px">
          <InfoHeaderRow>
            <InfoIconWrapper>
              <Icon name="Workspace02" size={20} color="#E8EAED" />
            </InfoIconWrapper>
            <InfoLabel>이름</InfoLabel>
          </InfoHeaderRow>
          <InfoContent>Dev Snapshot - v1.2</InfoContent>
        </InfoSectionColumn>

        {/* 설명 */}
        <InfoSectionColumn top="130px" height="200px">
          <InfoHeaderRow>
            <InfoIconWrapper>
              <Icon name="Description" size={20} color="#E8EAED" />
            </InfoIconWrapper>
            <InfoLabel>설명</InfoLabel>
          </InfoHeaderRow>
          <InfoContent>{description}</InfoContent>
        </InfoSectionColumn>

        {/* 상태 */}
        <InfoSectionRow top="338px">
          <InfoIconWrapper>
            <Icon name="Info" size={20} color="#E8EAED" />
          </InfoIconWrapper>
          <InfoLabel>상태</InfoLabel>
          <StatusIndicator>
            <StatusDot color="#98BDFF" />
            <StatusText color="#98BDFF">실행중</StatusText>
          </StatusIndicator>
        </InfoSectionRow>

        {/* 생성자 */}
        <InfoSectionRow top="386px">
          <InfoIconWrapper>
            <Icon name="PersonFilled" size={20} color="#E8EAED" />
          </InfoIconWrapper>
          <InfoLabel>생성자 :</InfoLabel>
          <InfoRowValue>이수빈</InfoRowValue>
        </InfoSectionRow>

        {/* 생성일 */}
        <InfoSectionRow top="434px">
          <InfoIconWrapper>
            <Icon name="Calendar01" size={20} color="#E8EAED" />
          </InfoIconWrapper>
          <InfoLabel>생성일 :</InfoLabel>
          <InfoRowValue>2025.01.01</InfoRowValue>
        </InfoSectionRow>
      </ImageInfoCard>

      {/* 검증 진행중인 목록 */}
      <AsideFillCard title="검증 진행중인 목록" titleExtra="총 3개">
        <ValidationList>
          <PrivateRegistryValidationCard
            version="Version 1.0.0"
            creator="홍길동"
            createdDate="2025.06.15"
            lastVerifiedDate="2025.06.15"
            imageSize="125.4 MB"
            vulnerabilities={{
              critical: 2,
              high: 5,
              medium: 3,
              low: 1,
            }}
          />

          <PrivateRegistryValidationCard
            version="Version 1.1.0"
            creator="이영희"
            createdDate="2025.06.16"
            lastVerifiedDate="2025.06.16"
            imageSize="128.2 MB"
            vulnerabilities={{
              high: 2,
              medium: 4,
              low: 2,
            }}
          />

          <PrivateRegistryValidationCard
            version="Version 1.2.0"
            creator="김철수"
            createdDate="2025.06.17"
            lastVerifiedDate="2025.06.17"
            imageSize="130.1 MB"
            vulnerabilities={{
              critical: 1,
              medium: 2,
              low: 5,
            }}
          />
        </ValidationList>
      </AsideFillCard>

      {/* 설명 수정 모달 */}
      <EditDescriptionModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditDescription}
        initialDescription={description}
      />
    </Container>
  );
}


// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;
`;

const ImageInfoCard = styled.div`
  width: 400px;
  height: 490px;
  background-color: #171b26;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
`;

const CardTitle = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px is closest to 14px
})`
  position: absolute;
  left: 26px;
  top: 24px;
  font-size: 14px; // Keep custom 14px
  font-weight: 700; // Keep 700 weight
  color: #f5f5f5;
`;

const EditButton = styled.button`
  position: absolute;
  right: 24px;
  top: 14px;
  width: 30px;
  height: 30px;
  background-color: #171b26;
  border: 1px solid #343c50;
  border-radius: 2px;
  box-shadow:
    0px 2px 4px 0px rgba(8, 10, 15, 1),
    inset 0px 2px 4px -1px rgba(8, 10, 15, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

// 컬럼 레이아웃 (아이콘+제목 위, 내용 아래)
const InfoSectionColumn = styled.div<{ top: string; height?: string }>`
  position: absolute;
  left: 24px;
  top: ${(props) => props.top};
  width: 352px;
  height: ${(props) => props.height || "40px"};
  background-color: #070913;
  border: 1px solid #2a3041;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 12px;
  box-sizing: border-box;
`;

// 로우 레이아웃 (한 줄에 모든 요소)
const InfoSectionRow = styled.div<{ top: string; height?: string }>`
  position: absolute;
  left: 24px;
  top: ${(props) => props.top};
  width: 352px;
  height: ${(props) => props.height || "40px"};
  background-color: #070913;
  border: 1px solid #2a3041;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  box-sizing: border-box;
  gap: 12px;
`;

// 아이콘+제목 헤더 행
const InfoHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const InfoIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  background-color: #070913;
  border: 1px solid #2a3041;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const InfoLabel = styled(Typography.Text).attrs({
  variant: "body-2-1", // 12px, 700 weight
})`
  color: #f5f5f5;
`;

// 컬럼 레이아웃용 내용
const InfoContent = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
})`
  line-height: 1.33;
  color: #cacaca;
  flex: 1;
`;

// 로우 레이아웃용 값
const InfoRowValue = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
})`
  color: #cacaca;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusDot = styled.div<{ color: string }>`
  width: 6px;
  height: 6px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
`;

const StatusText = styled(Typography.Text).attrs({
  variant: "body-2-3", // 12px, 500 weight
  as: "span",
})<{ color: string }>`
  color: ${(props) => props.color};
`;

const ValidationList = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  padding-right: 0px;
`;
