"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styled from "styled-components";
import { Button, Icon, Modal, Switch, Typography } from "xiilab-ui";

import {
  getGetCommitImagePolicyQueryKey,
  useGetCommitImagePolicy,
  useUpdateCommitImagePolicy,
} from "@/api/generated/admin-workspace/admin-workspace";
import { useGetAllPolicies } from "@/api/generated/workload-reclaim-policy-admin/workload-reclaim-policy-admin";
import { WorkloadTypeCriteriaCard } from "@/domain/revoke/components/workload-type-criteria-card";
import { openResourceRevokeCriteriaModalAtom } from "@/domain/revoke/state/revoke-history.atom";
import { SettingBox } from "@/domain/system-setting/components/setting-box";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { TooltipHighlightText } from "@/styles/mixins/text";

export function ResourceRevokeSetting() {
  const queryClient = useQueryClient();
  const { data: policyList } = useGetAllPolicies();
  const { data: commitImagePolicy } = useGetCommitImagePolicy();
  const { mutate: updateCommitImagePolicy, isPending } =
    useUpdateCommitImagePolicy();

  const { onOpen } = useGlobalModal(openResourceRevokeCriteriaModalAtom);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingChecked, setPendingChecked] = useState(false);

  const isCommitImageEnabled = commitImagePolicy?.isCommitImageEnabled ?? false;

  const handleEdit = () => {
    // 모달을 열면 자동으로 두 기준 모두 로드됨
    onOpen();
  };

  const handleSnapshotToggle = (checked: boolean) => {
    setPendingChecked(checked);
    setConfirmOpen(true);
  };

  const handleConfirmOk = () => {
    if (isPending) return;

    updateCommitImagePolicy(
      { data: { isCommitImageEnabled: pendingChecked } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetCommitImagePolicyQueryKey(),
          });
          setConfirmOpen(false);
        },
      },
    );
  };

  const handleConfirmCancel = () => {
    if (isPending) return;
    setConfirmOpen(false);
  };

  // Interactive와 Batch 기준 분리
  const interactivePolicy = policyList?.find(
    (policy) => policy.workloadJobType === "INTERACTIVE",
  );
  const batchPolicy = policyList?.find(
    (policy) => policy.workloadJobType === "BATCH",
  );

  return (
    <SettingBox
      title="리소스 회수 기준"
      titleExtra={
        <GuideTooltip
          placement="right"
          maxWidth="600px"
          title={
            <>
              리소스 사용률이 일정 시간 동안 설정 기준값을 넘지 못할 경우
              <br />
              <TooltipHighlightText>리소스가 회수</TooltipHighlightText>
              됩니다. MIG, MPS는 리소스 회수 대상이 아닙니다.
            </>
          }
        />
      }
      extra={
        <Button variant="outlined" size="small" onClick={handleEdit}>
          수정
        </Button>
      }
      height={330}
    >
      <CardsWrapper>
        {batchPolicy && (
          <WorkloadTypeCriteriaCard
            criteria={batchPolicy}
            enabled={batchPolicy.isEnabled}
            switchDisabled
          />
        )}
        {interactivePolicy && (
          <WorkloadTypeCriteriaCard
            criteria={interactivePolicy}
            enabled={interactivePolicy.isEnabled}
            switchDisabled
          />
        )}
      </CardsWrapper>
      <SnapshotImageSection>
        <SnapshotImageLabelWrapper>
          <Typography.Text variant="body-2-1">
            리소스 회수/종료 시 Snapshot Image 자동 생성
          </Typography.Text>
          <GuideTooltip
            placement="right"
            maxWidth="500px"
            title={
              <>
                종료 시점의 실행 환경을 Snapshot Image로 서버에 저장하여,
                <br />
                워크로드 재시작 시 동일한 환경을 복원합니다.
                <br />
                레지스트리 이미지 목록에는 표시되지 않습니다.
              </>
            }
          />
        </SnapshotImageLabelWrapper>
        <Switch
          checked={isCommitImageEnabled}
          onChange={handleSnapshotToggle}
          disabled={isPending}
        />
      </SnapshotImageSection>

      <Modal
        variant={pendingChecked ? "confirm" : "error"}
        icon={
          <Icon
            name={pendingChecked ? "Setting01" : "Error"}
            color="#fff"
            size={20}
          />
        }
        modalWidth={340}
        open={confirmOpen}
        onCancel={handleConfirmCancel}
        onOk={handleConfirmOk}
        title={`Snapshot Image 자동 생성 ${pendingChecked ? "활성화" : "비활성화"}`}
        centered
        okButtonProps={{ loading: isPending }}
        cancelButtonProps={{ disabled: isPending }}
      >
        Snapshot Image 자동 생성을{" "}
        <strong>{pendingChecked ? "활성화" : "비활성화"}</strong>
        하시겠습니까?
      </Modal>
    </SettingBox>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const CardsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const SnapshotImageSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  padding: 15px 14px;
  background-color: #f7f9fb;
  border: 1px solid #e9ebee;
  border-radius: 4px;
`;

const SnapshotImageLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
