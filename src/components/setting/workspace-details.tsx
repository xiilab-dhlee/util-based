"use client";

import { useSetAtom } from "jotai";
import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import { openNotificationSettingModalAtom } from "@/atoms/setting/setting-modal.atom";
import {
  openDeleteSingleWorkspaceModalWithDataAtom,
  openUpdateWorkspaceModalWithDataAtom,
} from "@/atoms/workspace/workspace-modal.atom";
import { NotificationSettingModal } from "@/components/setting/modal/notification-setting-modal";
import { DeleteSingleWorkspaceModal } from "@/components/workspace/delete-single-workspace-modal";
import { UpdateWorkspaceModal } from "@/components/workspace/update-workspace-modal";
import IntegratedResourceCard from "./integrated-resource-card";
import WorkloadStatusGrid, {
  type WorkloadStatusData,
} from "./workload-status-grid";

/**
 * 워크스페이스 상세 정보 컴포넌트
 *
 * 워크스페이스의 상세 정보와 리소스 현황을 보여주는 컴포넌트입니다.
 * - 리소스 사용량 (GPU, CPU, MEM)
 * - 워크로드 현황 통계
 * - 워크스페이스 기본 정보
 */
export function WorkspaceDetails() {
  // 알림 설정 모달 열기 함수
  const openNotificationModal = useSetAtom(openNotificationSettingModalAtom);
  // 워크스페이스 수정 모달 열기 함수
  const openUpdateWorkspaceModal = useSetAtom(
    openUpdateWorkspaceModalWithDataAtom,
  );
  // 워크스페이스 삭제 모달 열기 함수
  const openDeleteSingleWorkspaceModal = useSetAtom(
    openDeleteSingleWorkspaceModalWithDataAtom,
  );

  // 워크로드 상태 데이터 - 확장 가능한 구조
  const workloadData: WorkloadStatusData[] = [
    {
      type: "running",
      count: "10건",
      label: "실행중",
      metadata: {
        description: "현재 실행 중인 워크로드",
        priority: "high",
      },
    },
    {
      type: "stopped",
      count: "6건",
      label: "종료",
      metadata: {
        description: "종료된 워크로드",
        priority: "normal",
      },
    },
    {
      type: "waiting",
      count: "6건",
      label: "대기중",
      metadata: {
        description: "대기 중인 워크로드",
        priority: "medium",
      },
    },
    {
      type: "error",
      count: "10건",
      label: "에러",
      metadata: {
        description: "오류가 발생한 워크로드",
        priority: "urgent",
      },
    },
  ];

  // 워크로드 카드 클릭 핸들러 (향후 확장용)
  const handleWorkloadClick = (data: WorkloadStatusData) => {
    console.log(`Clicked ${data.label} (${data.count})`, data.metadata);
    // 여기에 상세 정보 모달이나 페이지 이동 로직 추가 가능
  };

  // 워크스페이스 수정 핸들러
  const handleEditWorkspace = () => {
    // 현재 워크스페이스 정보 (실제로는 API에서 가져와야 함)
    const currentWorkspaceData = {
      id: "workspace-1", // 실제 워크스페이스 ID
      name: "AI 모델팀_WorkSpace",
      description:
        "Infra Core 모델팀에서 활용할 WorkSpace입니다. yolov5, yolov8 Detect model을 활용한 연구를 진행합니다. AI 학습을 위한 워크스페이스입니다.",
    };

    openUpdateWorkspaceModal(currentWorkspaceData);
  };

  // 워크스페이스 삭제 핸들러
  const handleDeleteWorkspace = () => {
    // 현재 워크스페이스 정보 (실제로는 API에서 가져와야 함)
    const currentWorkspaceData = {
      id: "workspace-1", // 실제 워크스페이스 ID
      name: "AI 모델팀_WorkSpace",
    };

    openDeleteSingleWorkspaceModal(currentWorkspaceData);
  };

  return (
    <Container>
      <Header>
        <Title>워크스페이스</Title>
        <NotificationButton onClick={openNotificationModal}>
          <Icon name="Noti" color="#ffffff" size={24} />
          알림 설정
        </NotificationButton>
      </Header>

      <Content>
        {/* 좌측: 리소스 & 워크로드 섹션 */}
        <LeftSection>
          {/* 리소스 현황 */}
          <SectionTitle>리소스</SectionTitle>
          <SectionDescription>
            해당 워크스페이스에서 사용되는 자원 정보를 확인할 수 있습니다.
          </SectionDescription>

          <ResourceGrid>
            <IntegratedResourceCard
              type="gpu"
              label="GPU in use"
              number="2"
              unit="개"
            />
            <IntegratedResourceCard
              type="cpu"
              label="CPU in use"
              number="4"
              unit="CORE"
            />
            <IntegratedResourceCard
              type="memory"
              label="MEM in use"
              number="8"
              unit="GB"
            />
          </ResourceGrid>

          {/* 워크로드 현황 */}
          <WorkloadSection>
            <SectionTitle>워크로드</SectionTitle>
            <SectionDescription>
              해당 워크스페이스 내 생성한 워크로드 정보를 확인할 수 있습니다.
            </SectionDescription>

            {/* 새로운 확장 가능한 그리드 컴포넌트 사용 */}
            <WorkloadStatusGrid
              data={workloadData}
              columns={4}
              cardSize={136}
              gap={12}
              onCardClick={handleWorkloadClick}
            />
          </WorkloadSection>
        </LeftSection>

        {/* 우측: 상세 정보 섹션 */}
        <RightSection>
          <DetailHeader>
            <DetailTitle>상세 정보</DetailTitle>
            <ActionButtons>
              <ActionButton onClick={handleEditWorkspace}>
                <Icon name="Edit02" color="#CED5DB" size={16} />
              </ActionButton>
              <ActionButton onClick={handleDeleteWorkspace}>
                <Icon name="Delete" color="#CED5DB" size={16} />
              </ActionButton>
            </ActionButtons>
          </DetailHeader>

          <DetailList>
            <DetailItem height={70}>
              <DetailItemHeader>
                <IconBox>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="12"
                    viewBox="0 0 10 12"
                    fill="none"
                  >
                    <path
                      d="M4.44444 10.0194V6.08063L1.11111 4.0825V8.02125L4.44444 10.0194ZM5.55556 10.0194L8.88889 8.02125V4.0825L5.55556 6.08063V10.0194ZM5 5.08875L8.29167 3.11937L5 1.15L1.70833 3.11937L5 5.08875ZM0.555556 9.0275C0.37963 8.92208 0.243056 8.78312 0.145833 8.61063C0.0486111 8.43813 0 8.24646 0 8.03563V3.46438C0 3.25354 0.0486111 3.06188 0.145833 2.88937C0.243056 2.71688 0.37963 2.57792 0.555556 2.4725L4.44444 0.158125C4.62037 0.0527083 4.80556 0 5 0C5.19444 0 5.37963 0.0527083 5.55556 0.158125L9.44444 2.4725C9.62037 2.57792 9.75694 2.71688 9.85417 2.88937C9.95139 3.06188 10 3.25354 10 3.46438V8.03563C10 8.24646 9.95139 8.43813 9.85417 8.61063C9.75694 8.78312 9.62037 8.92208 9.44444 9.0275L5.55556 11.3419C5.37963 11.4473 5.19444 11.5 5 11.5C4.80556 11.5 4.62037 11.4473 4.44444 11.3419L0.555556 9.0275Z"
                      fill="#E8EAED"
                    />
                  </svg>
                </IconBox>
                <DetailLabel>워크스페이스 이름</DetailLabel>
              </DetailItemHeader>
              <DetailValue>AI 모델팀_WorkSpace</DetailValue>
            </DetailItem>

            <DetailItem height={126}>
              <DetailItemHeader>
                <IconBox>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="12"
                    viewBox="0 0 10 12"
                    fill="none"
                  >
                    <path
                      d="M2.5 8.4H7.5V9.6H2.5V8.4ZM2.5 6H7.5V7.2H2.5V6ZM6.25 0H1.25C0.5625 0 0 0.54 0 1.2V10.8C0 11.46 0.55625 12 1.24375 12H8.75C9.4375 12 10 11.46 10 10.8V3.6L6.25 0ZM8.75 10.8H1.25V1.2H5.625V4.2H8.75V10.8Z"
                      fill="#E8EAED"
                    />
                  </svg>
                </IconBox>
                <DetailLabel>워크스페이스 설명</DetailLabel>
              </DetailItemHeader>
              <DetailValue>
                Infra Core 모델팀에서 활용할 WorkSpace입니다. yolov5, yolov8
                Detect model을 활용한 연구를 진행합니다. AI 학습을 위한
                워크스페이스입니다.
              </DetailValue>
            </DetailItem>

            <DetailItem height={40} padding="8px">
              <DetailItemHeaderInline>
                <IconBox>
                  <Icon name="PersonFilled" color="#E8EAED" size={14} />
                </IconBox>
                <DetailLabelInline>생성자 :</DetailLabelInline>
                <DetailValueInline>이수빈</DetailValueInline>
              </DetailItemHeaderInline>
            </DetailItem>

            <DetailItem height={40} padding="8px">
              <DetailItemHeaderInline>
                <IconBox>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M10.2026 1.20012H9.6025V0H8.40237V1.20012H3.60187V0H2.40175V1.20012H1.80169C1.13562 1.20012 0.607563 1.74018 0.607563 2.40025L0.601562 10.8011C0.601562 11.4612 1.13562 12.0012 1.80169 12.0012H10.2026C10.8626 12.0012 11.4027 11.4612 11.4027 10.8011V2.40025C11.4027 1.74018 10.8626 1.20012 10.2026 1.20012ZM10.2026 10.8011H1.80169V4.8005H10.2026V10.8011ZM10.2026 3.60037H1.80169V2.40025H10.2026V3.60037ZM4.20194 7.20075H3.00181V6.00062H4.20194V7.20075ZM6.60219 7.20075H5.40206V6.00062H6.60219V7.20075ZM9.00244 7.20075H7.80231V6.00062H9.00244V7.20075ZM4.20194 9.601H3.00181V8.40087H4.20194V9.601ZM6.60219 9.601H5.40206V8.40087H6.60219V9.601ZM9.00244 9.601H7.80231V8.40087H9.00244V9.601Z"
                      fill="#E8EAED"
                    />
                  </svg>
                </IconBox>
                <DetailLabelInline>생성일 :</DetailLabelInline>
                <DetailValueInline>2025.01.01</DetailValueInline>
              </DetailItemHeaderInline>
            </DetailItem>
          </DetailList>
        </RightSection>
      </Content>

      {/* 알림 설정 모달 */}
      <NotificationSettingModal />

      {/* 워크스페이스 수정 모달 */}
      <UpdateWorkspaceModal />

      {/* 워크스페이스 삭제 모달 */}
      <DeleteSingleWorkspaceModal />
    </Container>
  );
}

const Container = styled.div`
  background: #070913;
  border-radius: 10px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  padding: 16px 24px 24px 24px;
  width: 964px;
  height: 448px;
  color: #f5f5f5;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled(Typography.Text).attrs({
  variant: "subtitle-1", // 16px variant
  as: "h2",
})`
  color: #f5f5f5;
  margin: 0;
`;

const NotificationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 30px;
  background: #171b26;
  border: 1px solid #9a9eb4;
  border-radius: 2px;
  color: #ffffff;
  cursor: pointer;
  box-shadow:
    0px 2px 4px 0px rgba(8, 10, 15, 1),
    inset 0px 2px 4px -1px rgba(8, 10, 15, 1);

  // Typography styles
  font-weight: 600;
  font-size: 12px;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
  flex: 1;
`;

const LeftSection = styled.div`
  background: #171b26;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  width: 596px;
  height: 370px;
`;

const SectionTitle = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px is closest to 14px
  as: "h3",
})`
  color: #f5f5f5;
  margin: 0;
  font-weight: 700; // Keep 700 weight
`;

const SectionDescription = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
  as: "p",
})`
  color: #bdbdbd;
  margin: 4px 0 12px 0;
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

const WorkloadSection = styled.div`
  /* 리소스 카드들과 24px 간격 유지 */
`;

/* WorkloadGrid는 이제 WorkloadStatusGrid 컴포넌트로 대체됨 */

const RightSection = styled.div`
  background: #171b26;
  border-radius: 8px;
  padding: 14px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  width: 310px;
  height: 370px;
  overflow: hidden;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const DetailTitle = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px is closest to 14px
  as: "h3",
})`
  color: #f5f5f5;
  margin: 0;
  font-weight: 700; // Keep 700 weight
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
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

const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const DetailItem = styled.div<{ height?: number; padding?: string }>`
  background: #070913;
  border: 1px solid #2a3041;
  border-radius: 4px;
  padding: ${(props) => props.padding || "10px"};
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: ${(props) => (props.height ? `${props.height}px` : "auto")};
`;

const DetailItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailItemHeaderInline = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconBox = styled.div`
  width: 24px;
  height: 24px;
  border: 1px solid #2a3041;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const DetailLabel = styled(Typography.Text).attrs({
  variant: "body-2-1", // 12px, 700 weight
})`
  color: #f5f5f5;
  display: flex;
  align-items: center;
`;

const DetailLabelInline = styled(Typography.Text).attrs({
  variant: "body-2-1", // 12px, 700 weight
})`
  color: #f5f5f5;
  margin-right: 4px;
`;

const DetailValueInline = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
  as: "span",
})`
  color: #cacaca;
  line-height: 16px;
`;

const DetailValue = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
})`
  color: #cacaca;
  line-height: 16px;
`;
