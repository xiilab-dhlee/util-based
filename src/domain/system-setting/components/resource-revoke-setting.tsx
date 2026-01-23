"use client";

import { useState } from "react";
import styled from "styled-components";
import { Button, Switch } from "xiilab-ui";

import { WorkloadTypeCriteriaCard } from "@/domain/revoke/components/workload-type-criteria-card";
import { useGetRevokeCriteria } from "@/domain/revoke/hooks/use-get-revoke-criteria";
import { openResourceRevokeCriteriaModalAtom } from "@/domain/revoke/state/revoke-history.atom";
import { SettingBox } from "@/domain/system-setting/components/setting-box";
import type { WorkloadJobType } from "@/domain/workload/schemas/workload.schema";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { TooltipHighlightText } from "@/styles/mixins/text";

/**
 * 리소스 회수 기준 설정 컴포넌트
 * 자체적으로 API 호출 및 상태 관리를 담당
 */
export function ResourceRevokeSetting() {
  const { data: criteriaList } = useGetRevokeCriteria();
  const { onOpen } = useGlobalModal(openResourceRevokeCriteriaModalAtom);

  // 각 Job Type별 사용 유무 상태 관리
  const [interactiveEnabled, setInteractiveEnabled] = useState(true);
  const [batchEnabled, setBatchEnabled] = useState(true);
  // 대기 상태 워크로드 생성 사용 유무
  const [standbyWorkloadEnabled, setStandbyWorkloadEnabled] = useState(true);

  const handleEdit = () => {
    // 모달을 열면 자동으로 두 기준 모두 로드됨
    onOpen();
  };

  const handleEnabledChange = (jobType: WorkloadJobType, enabled: boolean) => {
    if (jobType === "INTERACTIVE") {
      setInteractiveEnabled(enabled);
    } else {
      setBatchEnabled(enabled);
    }
  };

  // Interactive와 Batch 기준 분리
  const interactiveCriteria = criteriaList?.find(
    (criteria) => criteria.jobType === "INTERACTIVE",
  );
  const batchCriteria = criteriaList?.find(
    (criteria) => criteria.jobType === "BATCH",
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
      <ContentWrapper>
        <CardsWrapper>
          {batchCriteria && (
            <WorkloadTypeCriteriaCard
              criteria={batchCriteria}
              enabled={batchEnabled}
              onEnabledChange={(enabled) =>
                handleEnabledChange("BATCH", enabled)
              }
            />
          )}
          {interactiveCriteria && (
            <WorkloadTypeCriteriaCard
              criteria={interactiveCriteria}
              enabled={interactiveEnabled}
              onEnabledChange={(enabled) =>
                handleEnabledChange("INTERACTIVE", enabled)
              }
            />
          )}
        </CardsWrapper>

        <StandbyWorkloadSection>
          <StandbyWorkloadTitle>
            대기 상태 워크로드 생성
            <GuideTooltip
              placement="right"
              maxWidth="320px"
              title={
                <>
                  대기 상태 워크로드 생성은 즉시 할당 가능한 자원이 부족할 경우,
                  <br />
                  워크로드를{" "}
                  <TooltipHighlightText>
                    대기 상태로 생성할지
                  </TooltipHighlightText>{" "}
                  아니면{" "}
                  <TooltipHighlightText>생성을 차단할지</TooltipHighlightText>
                  결정합니다.
                </>
              }
            />
          </StandbyWorkloadTitle>
          <Switch
            checked={standbyWorkloadEnabled}
            onChange={setStandbyWorkloadEnabled}
          />
        </StandbyWorkloadSection>
      </ContentWrapper>
    </SettingBox>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const CardsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
`;

const StandbyWorkloadSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 46px;
  padding: 0 14px;
  background: var(--color-gray-15);
  border: 1px solid var(--color-gray-10);
  border-radius: 4px;
`;

const StandbyWorkloadTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: Pretendard;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: #000000;
`;
