"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";
import styled from "styled-components";
import type { ResponsiveColumnType } from "xiilab-ui";
import { Button, Icon, Table, Typography } from "xiilab-ui";

import type { ResourceRequest } from "@/atoms/setting/setting-modal.atom";
import {
  openRejectionReasonModalAtom,
  openRequestReasonModalAtom,
  openResourceSettingModalAtom,
} from "@/atoms/setting/setting-modal.atom";
import { EmptyState } from "@/components/common/empty-state/empty-state";
import RejectionReasonModal from "@/components/setting/modal/rejection-reason-modal";
import RequestReasonModal from "@/components/setting/modal/request-reason-modal";
import ResourceSettingModal from "@/components/setting/modal/resource-setting-modal";

/**
 * 리소스 신청 목록 컴포넌트
 *
 * 사용자들의 리소스 신청 현황을 관리하는 컴포넌트입니다.
 * - 리소스 신청 목록 테이블
 * - 승인/반려 관리
 * - 페이지네이션
 */
export default function ResourceRequests() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // 모달 열기 함수들
  const openResourceModal = useSetAtom(openResourceSettingModalAtom);
  const openRejectionModal = useSetAtom(openRejectionReasonModalAtom);
  const openRequestModal = useSetAtom(openRequestReasonModalAtom);

  // 임시 데이터
  // const requests = [];
  const requests = [
    {
      key: 1,
      id: 1,
      gpu: "3개",
      cpu: "12Core",
      mem: "50GB",
      requestDate: "2025.01.01",
      requestTime: "09:00",
      status: "대기",
      approvalDate: "2025.01.01",
      approvalTime: "09:00",
      rejectionReason: null,
      reason: "요청사유",
    },
    {
      id: 2,
      gpu: "5개",
      cpu: "8Core",
      mem: "50GB",
      requestDate: "2025.01.01",
      requestTime: "09:00",
      status: "승인",
      approvalDate: "2025.01.01",
      approvalTime: "09:00",
      rejectionReason: null,
      reason: "요청사유",
    },
    {
      id: 3,
      gpu: "1개",
      cpu: "32Core",
      mem: "18GB",
      requestDate: "2025.01.01",
      requestTime: "09:00",
      status: "승인",
      approvalDate: "2025.01.01",
      approvalTime: "09:00",
      rejectionReason: null,
      reason: "요청사유",
    },
    {
      id: 4,
      gpu: "4개",
      cpu: "8Core",
      mem: "30GB",
      requestDate: "2025.01.01",
      requestTime: "09:00",
      status: "승인",
      approvalDate: "2025.01.01",
      approvalTime: "09:00",
      rejectionReason: null,
      reason: "요청사유",
    },
    {
      id: 5,
      gpu: "2개",
      cpu: "2Core",
      mem: "14GB",
      requestDate: "2025.01.01",
      requestTime: "09:00",
      status: "승인",
      approvalDate: "2025.01.01",
      approvalTime: "09:00",
      rejectionReason: null,
      reason: "요청사유",
    },
    {
      id: 6,
      gpu: "9개",
      cpu: "8Core",
      mem: "10GB",
      requestDate: "2025.01.01",
      requestTime: "09:00",
      status: "승인",
      approvalDate: "2025.01.01",
      approvalTime: "09:00",
      rejectionReason: null,
      reason: "요청사유",
    },
    {
      id: 7,
      gpu: "9개",
      cpu: "8Core",
      mem: "10GB",
      requestDate: "2025.01.01",
      requestTime: "09:00",
      status: "반려",
      approvalDate: "2025.01.01",
      approvalTime: "09:00",
      rejectionReason:
        "리소스 사용량이 권장량을 넘었습니다. 너무 많은 MEM 리소스 신청으로 리소스 신청 반려합니다.",
      reason:
        "AstraGo 2.0 AI Learning에 사용되는 리소스가 부족하여 MEM 리소스 추가 요청드립니다.",
    },
    {
      id: 8,
      gpu: "23개",
      cpu: "8Core",
      mem: "20GB",
      requestDate: "2025.01.01",
      requestTime: "09:00",
      status: "반려",
      approvalDate: "2025.01.01",
      approvalTime: "09:00",
      rejectionReason:
        "요청하신 GPU 리소스가 현재 클러스터 용량을 초과합니다. 더 적은 양의 리소스 재신청을 권장합니다.",
      reason:
        "대규모 병렬 처리 작업을 위한 GPU 리소스 요청입니다. 딥러닝 모델 훈련용도로 사용 예정입니다.",
    },
  ].map((item, index) => ({ ...item, key: index + 1 }));

  // 테이블 컬럼 정의
  const columns: ResponsiveColumnType<any>[] = [
    {
      title: "신청일시",
      key: "requestDateTime",
      width: 160,
      render: (_: any, record: any) => (
        <div>
          <div>{record.requestDate}</div>
        </div>
      ),
    },
    {
      title: "GPU",
      dataIndex: "gpu",
      key: "gpu",
      width: 80,
      align: "center",
    },
    {
      title: "CPU",
      dataIndex: "cpu",
      key: "cpu",
      width: 80,
      align: "center",
    },
    {
      title: "MEM",
      dataIndex: "mem",
      key: "mem",
      width: 80,
      align: "center",
    },
    {
      title: "승인여부",
      dataIndex: "status",
      key: "status",
      width: 80,
      align: "center",
      render: (status: string) => (
        <StatusBadge status={status}>{status}</StatusBadge>
      ),
    },
    {
      title: "승인일시",
      key: "approvalDateTime",
      width: 120,
      render: (_: any, record: any) => {
        return record.approvalDate ? (
          <div>
            {record.approvalDate} {record.approvalTime}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      title: "반려사유",
      key: "rejectionReason",
      width: 60,
      align: "center",
      render: (_: any, record: any) => {
        if (record.status === "반려" && record.rejectionReason) {
          return (
            <ButtonContainer>
              <RejectionIconButton
                hasRejection
                onClick={() => openRejectionModal(record as ResourceRequest)}
              >
                <Icon name="Notice" size={18} color="#404040" />
              </RejectionIconButton>
            </ButtonContainer>
          );
        }
        return (
          <ButtonContainer>
            <RejectionIconButton disabled>
              <Icon name="Notice" size={18} color="#D1D1D1" />
            </RejectionIconButton>
          </ButtonContainer>
        );
      },
    },
    {
      title: "요청사유",
      key: "reason",
      width: 60,
      align: "center",
      render: (_: any, record: any) => {
        return (
          <ButtonContainer>
            <RequestIconButton
              onClick={() => openRequestModal(record as ResourceRequest)}
            >
              <Icon name="MoreHorizonal" size={18} color="#404040" />
            </RequestIconButton>
          </ButtonContainer>
        );
      },
    },
  ];

  return (
    <Container>
      <Header>
        <Title>리소스 신청 목록</Title>
        <RequestCount>총 {requests.length}건</RequestCount>
        <Button
          color="primary"
          variant="gradient"
          width={120}
          height={30}
          icon="Request"
          iconSize={18}
          iconPosition="left"
          style={{ marginLeft: "auto", fontSize: "13px", fontWeight: 500 }}
          onClick={openResourceModal}
        >
          리소스 요청
        </Button>
      </Header>

      <ContentContainer>
        {requests.length === 0 ? (
          <EmptyState
            icon={<Icon name="EditDocumentFilled" color="#878898" size={32} />}
            title="리소스 신청 목록이 없습니다."
            content="리소스 요청 버튼을 클릭하여 부족한 리소스를 요청해 보세요."
          />
        ) : (
          <TableContainer>
            <Table
              columns={columns}
              dataSource={requests}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: requests.length,
                onChange: (page, size) => {
                  setCurrentPage(page);
                  if (size) setPageSize(size);
                },
                showSizeChanger: false,
                showQuickJumper: false,
              }}
              size="small"
            />
          </TableContainer>
        )}
      </ContentContainer>

      {/* 모달들 */}
      <ResourceSettingModal />
      <RejectionReasonModal />
      <RequestReasonModal />
    </Container>
  );
}

const Container = styled.div`
  background: #fafafa;
  border-radius: 10px;
  box-shadow: 0px 4px 10px 0px hsla(0, 0%, 0%, 0.15);
  padding: 24px;
  width: 964px;
  flex: 1;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 11px;
`;

const Title = styled(Typography.Text).attrs({
  variant: "subtitle-1", // 16px variant
  as: "h2",
})`
  color: #000000;
  margin: 0;
  margin-right: 6px;
`;

const RequestCount = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
  as: "span",
})`
  color: #000000;
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;

  .ant-table {
    border-radius: 4px;
    border: 1px solid #e1e4e7;
  }

  .ant-table-thead > tr > th {
    background: #f3f5f7;
    color: #000000;
    border-bottom: 1px solid #e1e4e7;
    padding: 0 !important;
  }

  .ant-table-tbody > tr > td {
    color: #000000;
    border-bottom: 1px solid #e1e4e7;
    padding: 0 !important;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8f9fa !important;
  }
`;

const StatusBadge = styled(Typography.Text).attrs({
  variant: "body-2-3", // 12px, 500 weight
})<{ status: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: ${({ status }) => {
    switch (status) {
      case "대기":
        return "#00911D";
      case "승인":
        return "#366BFF";
      case "반려":
        return "#E85A5A";
      default:
        return "#000000";
    }
  }};
`;

// 버튼 가운데 정렬을 위한 컨테이너
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

// 반려사유 아이콘 버튼
const RejectionIconButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !["hasRejection"].includes(prop),
})<{ disabled?: boolean; hasRejection?: boolean }>`
  width: 26px;
  height: 26px;
  background: ${({ hasRejection, disabled }) =>
    hasRejection ? "#fafafa" : disabled ? "#f3f3f3" : "#fafafa"};
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    background: ${({ disabled, hasRejection }) =>
      disabled ? "#f3f3f3" : hasRejection ? "#f0f0f0" : "#eeeeee"};
  }
`;

// 요청사유 아이콘 버튼
const RequestIconButton = styled.button`
  width: 26px;
  height: 26px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    background: #f0f0f0;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
