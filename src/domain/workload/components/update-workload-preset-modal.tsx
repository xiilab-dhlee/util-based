"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, Modal } from "xiilab-ui";

import type { WorkloadDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useUpdateResourcePreset } from "@/api/generated/workload/workload";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import {
  ModalDetailCardFull,
  ModalDetailColumn,
  ModalDetailDivider,
  ModalDetailInfoText,
  ModalDetailLabel,
  ModalDetailRow,
  ModalDetailSectionTitle,
  ModalDetailTwoColumnContainer,
  ModalDetailValue,
} from "@/styles/layers/modal-detail-layers.styled";
import { getWorkloadJobTypeInfo } from "../utils/workload.util";

/**
 * 워크로드 리소스 프리셋 변경 모달 컴포넌트
 *
 * 워크로드의 리소스 프리셋을 변경할 수 있는 모달입니다.
 * 왼쪽에는 기본 정보와 기존 리소스 정보를, 오른쪽에는 새 리소스 프리셋 선택을 표시합니다.
 */
export function UpdateWorkloadPresetModal() {
  const [open, setOpen] = useState(false);
  const [workloadData, setWorkloadData] =
    useState<WorkloadDetailResponse | null>(null);
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null);

  const { mutate, isPending } = useUpdateResourcePreset();

  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
    setWorkloadData(null);
    setWorkspaceId(null);
    setSelectedPresetId(null);
  };

  const handleOk = () => {
    if (isPending) return;
    if (!workloadData || workspaceId === null || selectedPresetId === null)
      return;

    mutate(
      {
        workspaceId,
        workloadResourceName: workloadData.workloadResourceName,
        data: {
          resourcePresetId: selectedPresetId,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  // 워크로드 상세 데이터와 workspaceId를 함께 받음
  useSubscribe<WorkloadDetailResponse & { workspaceId?: number }>(
    WORKLOAD_EVENTS.openChangeResourceModal,
    (payload) => {
      const { workspaceId: wsId, ...data } = payload;
      setWorkloadData(data);
      setWorkspaceId(wsId ?? null);
      setSelectedPresetId(data.resourcePreset?.resourcePresetId ?? null);
      setOpen(true);
    },
  );

  const { label, nodeType } = getWorkloadJobTypeInfo(
    workloadData?.workloadJobType,
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Resource" color="#fff" size={18} />}
      modalWidth={936}
      open={open}
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      title="워크로드 리소스 변경"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="재시작"
      onOk={handleOk}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled:
          !workloadData ||
          workspaceId === null ||
          selectedPresetId === null ||
          selectedPresetId === workloadData?.resourcePreset?.resourcePresetId,
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <Container>
        {/* 왼쪽: 기본 정보 및 기존 리소스 정보 */}
        <ModalDetailColumn>
          <ModalDetailCardFull>
            <ModalDetailSectionTitle>기본 정보</ModalDetailSectionTitle>
            <ModalDetailRow>
              <ModalDetailLabel $minWidth="100px">
                워크로드 이름
              </ModalDetailLabel>
              <ModalDetailValue>
                {workloadData?.workloadName || "-"}
              </ModalDetailValue>
            </ModalDetailRow>
            <ModalDetailRow>
              <ModalDetailLabel $minWidth="100px">Job Type</ModalDetailLabel>
              <ModalDetailValue>{label}</ModalDetailValue>
            </ModalDetailRow>
            <ModalDetailRow>
              <ModalDetailLabel $minWidth="100px">노드</ModalDetailLabel>
              <ModalDetailValue>{nodeType}</ModalDetailValue>
            </ModalDetailRow>
            <ModalDetailRow>
              <ModalDetailLabel $minWidth="100px">생성일시</ModalDetailLabel>
              <ModalDetailValue>-</ModalDetailValue>
            </ModalDetailRow>

            <ModalDetailDivider />

            <ModalDetailSectionTitle>기존 리소스 정보</ModalDetailSectionTitle>
            <ModalDetailRow>
              <ModalDetailLabel $minWidth="100px">GPU 이름</ModalDetailLabel>
              <ModalDetailValue>
                {workloadData?.resourcePreset?.resource?.gpu?.gpuName || "-"}
              </ModalDetailValue>
            </ModalDetailRow>
            <ModalDetailRow>
              <ModalDetailLabel $minWidth="100px">리소스 정보</ModalDetailLabel>
            </ModalDetailRow>
          </ModalDetailCardFull>
        </ModalDetailColumn>

        {/* 오른쪽: 리소스 프리셋 선택 */}
        <ModalDetailColumn>
          <ModalDetailCardFull>
            <ModalDetailSectionTitle>새 리소스 프리셋</ModalDetailSectionTitle>
            <ModalDetailInfoText>
              새로운 리소스 프리셋을 선택하면 워크로드가 재시작됩니다.
            </ModalDetailInfoText>
            {/* TODO: 리소스 프리셋 선택 컴포넌트 추가 필요 */}
            <PlaceholderBox>
              리소스 프리셋 선택 컴포넌트
              <br />
              (workloadJobType: {workloadData?.workloadJobType})
              <br />
              (nodeType: {workloadData?.nodeType})
            </PlaceholderBox>
          </ModalDetailCardFull>
        </ModalDetailColumn>
      </Container>
    </Modal>
  );
}

const Container = styled(ModalDetailTwoColumnContainer)`
  gap: 12px;
`;

const PlaceholderBox = styled.div`
  border: 1px dashed #c1c7ce;
  border-radius: 4px;
  padding: 24px;
  text-align: center;
  color: #666;
  font-size: 12px;
  background-color: #fafafa;
`;
