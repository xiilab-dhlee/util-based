"use client";

import styled from "styled-components";
import { Button } from "xiilab-ui";

import { useGetAllPolicies } from "@/api/generated/workload-reclaim-policy-admin/workload-reclaim-policy-admin";
import { WorkloadTypeCriteriaCard } from "@/domain/revoke/components/workload-type-criteria-card";
import { openResourceRevokeCriteriaModalAtom } from "@/domain/revoke/state/revoke-history.atom";
import { SettingBox } from "@/domain/system-setting/components/setting-box";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { TooltipHighlightText } from "@/styles/mixins/text";

export function ResourceRevokeSetting() {
  const { data: policyList } = useGetAllPolicies();

  const { onOpen } = useGlobalModal(openResourceRevokeCriteriaModalAtom);

  const handleEdit = () => {
    // 모달을 열면 자동으로 두 기준 모두 로드됨
    onOpen();
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
            onEnabledChange={() => {}}
            switchDisabled
          />
        )}
        {interactivePolicy && (
          <WorkloadTypeCriteriaCard
            criteria={interactivePolicy}
            enabled={interactivePolicy.isEnabled}
            onEnabledChange={() => {}}
            switchDisabled
          />
        )}
      </CardsWrapper>
    </SettingBox>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const CardsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
`;
