"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, type FieldErrors, useForm } from "react-hook-form";
import styled from "styled-components";
import { Form, Icon, InputNumber, Modal, Switch, Typography } from "xiilab-ui";

import {
  getGetAllPoliciesQueryKey,
  useGetAllPolicies,
  useUpdateReclaimPolicy,
} from "@/api/generated/workload-reclaim-policy-admin/workload-reclaim-policy-admin";
import {
  RECLAIM_POLICY_JOB_TYPES,
  REVOKE_CRITERIA_LIMITS,
  type ReclaimPolicyJobType,
} from "@/domain/revoke/constants/revoke-criteria.constant";
import { DEFAULT_RECLAIM_OPERATOR } from "@/domain/revoke/constants/revoke-history.constant";
import { useUpdateRevokeCriteriaEnabledAction } from "@/domain/revoke/hooks/revoke-criteria-actions";
import { openResourceRevokeCriteriaModalAtom } from "@/domain/revoke/state/revoke-history.atom";
import {
  createFieldId,
  createNumberChangeHandler,
} from "@/domain/revoke/utils/revoke-criteria-form.util";
import {
  collectEnabledUpdates,
  collectPolicyUpdates,
} from "@/domain/revoke/utils/revoke-criteria-submit.util";
import {
  type UpdateReclaimPolicyBodyExtended,
  updateReclaimPolicyBodyExtended,
} from "@/domain/revoke/utils/update-revoke-criteria-form.override.zod";
import { getJobTypeLabel } from "@/domain/workload/constants/workload.constant";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { LastFormItem } from "@/styles/layers/form-layer.styled";
import { errorTextStyle } from "@/styles/mixins/text";

const { Item: FormItem } = Form;

/**
 * 리소스 회수 기준 설정 모달
 * 참고: 최적화 기준(reclaimOperator)은 UI에서 제거되었으며,
 * 백엔드에는 항상 "OR"로 전송됩니다.
 */
export function ManageRevokeCriteriaModal() {
  const { open, onClose } = useGlobalModal(openResourceRevokeCriteriaModalAtom);
  const queryClient = useQueryClient();
  const { data: policyList, isLoading: isLoadingPolicies } =
    useGetAllPolicies();

  // enabled 상태
  const [batchEnabled, setBatchEnabled] = useState(false);
  const [interactiveEnabled, setInteractiveEnabled] = useState(false);

  // 정책 업데이트 actions
  const batchMutation = useUpdateReclaimPolicy();
  const interactiveMutation = useUpdateReclaimPolicy();

  // enabled 업데이트 action
  const enabledAction = useUpdateRevokeCriteriaEnabledAction();

  // React Hook Form - BATCH
  const batchForm = useForm<UpdateReclaimPolicyBodyExtended>({
    resolver: zodResolver(updateReclaimPolicyBodyExtended),
  });

  // React Hook Form - INTERACTIVE
  const interactiveForm = useForm<UpdateReclaimPolicyBodyExtended>({
    resolver: zodResolver(updateReclaimPolicyBodyExtended),
  });

  // formState.errors를 구독하여 리렌더링 트리거
  const batchErrors = batchForm.formState.errors;
  const interactiveErrors = interactiveForm.formState.errors;

  // 모달이 열릴 때 데이터 초기화
  useEffect(() => {
    if (open && policyList) {
      const batchPolicy = policyList.find(
        (p) => p.workloadJobType === RECLAIM_POLICY_JOB_TYPES.BATCH,
      );
      const interactivePolicy = policyList.find(
        (p) => p.workloadJobType === RECLAIM_POLICY_JOB_TYPES.INTERACTIVE,
      );

      if (batchPolicy) {
        batchForm.reset(
          {
            operatingHour: batchPolicy.operatingHour,
            metrics: batchPolicy.metrics ?? { gpu: 0, cpu: 0, mem: 0 },
            reclaimOperator: DEFAULT_RECLAIM_OPERATOR,
            reclaimWarningCount: batchPolicy.reclaimWarningCount,
          },
          { keepDirty: false, keepTouched: false, keepErrors: false },
        );
        setBatchEnabled(batchPolicy.isEnabled);
      }

      if (interactivePolicy) {
        interactiveForm.reset(
          {
            operatingHour: interactivePolicy.operatingHour,
            metrics: interactivePolicy.metrics ?? { gpu: 0, cpu: 0, mem: 0 },
            reclaimOperator: DEFAULT_RECLAIM_OPERATOR,
            reclaimWarningCount: interactivePolicy.reclaimWarningCount,
          },
          { keepDirty: false, keepTouched: false, keepErrors: false },
        );
        setInteractiveEnabled(interactivePolicy.isEnabled);
      }
    }
  }, [open, policyList, batchForm, interactiveForm]);

  const handleOk = async () => {
    // 활성화된 폼만 검증
    const batchValid = batchEnabled ? await batchForm.trigger() : true;
    const interactiveValid = interactiveEnabled
      ? await interactiveForm.trigger()
      : true;

    if (!batchValid || !interactiveValid) {
      return;
    }

    try {
      const policyUpdates = collectPolicyUpdates(
        batchForm,
        interactiveForm,
        batchMutation.mutateAsync,
        interactiveMutation.mutateAsync,
      );

      if (policyUpdates.length > 0) {
        await Promise.all(policyUpdates);
      }
    } catch (error) {
      console.error("[ManageRevokeCriteriaModal] 정책 업데이트 실패:", error);
      return;
    }

    try {
      const enabledUpdates = collectEnabledUpdates(
        policyList,
        batchEnabled,
        interactiveEnabled,
      );

      if (Object.keys(enabledUpdates).length > 0) {
        await enabledAction.mutateAsync(enabledUpdates);
      }
    } catch (error) {
      console.error(
        "[ManageRevokeCriteriaModal] enabled 상태 업데이트 실패:",
        error,
      );
      return;
    }

    void queryClient.invalidateQueries({
      queryKey: getGetAllPoliciesQueryKey(),
    });

    onClose();
  };

  const isPending =
    batchMutation.isPending ||
    interactiveMutation.isPending ||
    enabledAction.isPending;

  const handleCancel = () => {
    // 폼 에러 상태 초기화
    batchForm.reset(batchForm.getValues(), {
      keepDirty: false,
      keepTouched: false,
      keepErrors: false,
    });
    interactiveForm.reset(interactiveForm.getValues(), {
      keepDirty: false,
      keepTouched: false,
      keepErrors: false,
    });
    onClose();
  };

  const renderJobSection = (
    jobType: ReclaimPolicyJobType,
    form: ReturnType<typeof useForm<UpdateReclaimPolicyBodyExtended>>,
    errors: FieldErrors<UpdateReclaimPolicyBodyExtended>,
    enabled: boolean,
    setEnabled: (value: boolean) => void,
  ) => {
    const { control } = form;
    const { METRICS, OPERATING_HOUR, WARNING_COUNT } = REVOKE_CRITERIA_LIMITS;

    const gpuFieldId = createFieldId(jobType, "gpu");
    const cpuFieldId = createFieldId(jobType, "cpu");
    const memFieldId = createFieldId(jobType, "mem");
    const operatingHourFieldId = createFieldId(jobType, "operatingHour");
    const warningCountFieldId = createFieldId(jobType, "reclaimWarningCount");

    return (
      <JobSection>
        <SectionHeader>
          <SectionTitle>{getJobTypeLabel(jobType)} Job</SectionTitle>
          <Switch checked={enabled} onChange={setEnabled} />
        </SectionHeader>
        {/* GPU, CPU, Memory - 가로 3열 */}
        <ThreeColumnRow>
          <Controller
            name="metrics.gpu"
            control={control}
            render={({ field }) => (
              <StyledFormItem
                htmlFor={gpuFieldId}
                label={
                  <FieldLabel>
                    GPU <FieldLabelSub>(% 미만)</FieldLabelSub>
                  </FieldLabel>
                }
              >
                <InputNumber
                  id={gpuFieldId}
                  value={field.value}
                  onChange={createNumberChangeHandler(field.onChange, 0)}
                  status={errors.metrics?.gpu ? "error" : undefined}
                  disabled={!enabled}
                  width="100%"
                  height="30px"
                  min={METRICS.MIN}
                  max={METRICS.MAX}
                  controls={true}
                />
              </StyledFormItem>
            )}
          />

          <Controller
            name="metrics.cpu"
            control={control}
            render={({ field }) => (
              <StyledFormItem
                htmlFor={cpuFieldId}
                label={
                  <FieldLabel>
                    CPU <FieldLabelSub>(% 미만)</FieldLabelSub>
                  </FieldLabel>
                }
              >
                <InputNumber
                  id={cpuFieldId}
                  value={field.value}
                  onChange={createNumberChangeHandler(field.onChange, 0)}
                  status={errors.metrics?.cpu ? "error" : undefined}
                  disabled={!enabled}
                  width="100%"
                  height="30px"
                  min={METRICS.MIN}
                  max={METRICS.MAX}
                  controls={true}
                />
              </StyledFormItem>
            )}
          />

          <Controller
            name="metrics.mem"
            control={control}
            render={({ field }) => (
              <StyledFormItem
                htmlFor={memFieldId}
                label={
                  <FieldLabel>
                    Memory <FieldLabelSub>(% 미만)</FieldLabelSub>
                  </FieldLabel>
                }
              >
                <InputNumber
                  id={memFieldId}
                  value={field.value}
                  onChange={createNumberChangeHandler(field.onChange, 0)}
                  status={errors.metrics?.mem ? "error" : undefined}
                  disabled={!enabled}
                  width="100%"
                  height="30px"
                  min={METRICS.MIN}
                  max={METRICS.MAX}
                  controls={true}
                />
              </StyledFormItem>
            )}
          />

          {/* metrics 객체 레벨 에러 (최소 1개 필수) */}
          {(errors.metrics?.root?.message || errors.metrics?.message) && (
            <MetricsErrorMessage>
              {errors.metrics?.root?.message || errors.metrics?.message}
            </MetricsErrorMessage>
          )}
        </ThreeColumnRow>

        {/* 검사 주기, 경고 횟수 - 가로 2열 */}
        <TwoColumnRow>
          <Controller
            name="operatingHour"
            control={control}
            render={({ field }) => (
              <StyledLastFormItem
                required
                htmlFor={operatingHourFieldId}
                label={
                  <FieldLabel>
                    검사 주기 <FieldLabelSub>(시간)</FieldLabelSub>
                  </FieldLabel>
                }
                validateStatus={errors.operatingHour ? "error" : undefined}
                help={errors.operatingHour?.message}
              >
                <InputNumber
                  id={operatingHourFieldId}
                  value={field.value}
                  onChange={createNumberChangeHandler(
                    field.onChange,
                    OPERATING_HOUR.MIN,
                  )}
                  status={errors.operatingHour ? "error" : undefined}
                  disabled={!enabled}
                  width="100%"
                  height="30px"
                  min={OPERATING_HOUR.MIN}
                  max={OPERATING_HOUR.MAX}
                  controls={true}
                />
              </StyledLastFormItem>
            )}
          />

          <Controller
            name="reclaimWarningCount"
            control={control}
            render={({ field }) => (
              <StyledLastFormItem
                required
                htmlFor={warningCountFieldId}
                label={
                  <LabelWithTooltip>
                    <FieldLabel>
                      경고 횟수 <FieldLabelSub>(회)</FieldLabelSub>
                    </FieldLabel>
                    <GuideTooltip
                      title={
                        <>
                          설정한 횟수 이상부터는 더 이상의 경고 없이
                          <br />
                          리소스가 회수됩니다.
                        </>
                      }
                    />
                  </LabelWithTooltip>
                }
                validateStatus={
                  errors.reclaimWarningCount ? "error" : undefined
                }
                help={errors.reclaimWarningCount?.message}
              >
                <InputNumber
                  id={warningCountFieldId}
                  value={field.value}
                  onChange={createNumberChangeHandler(
                    field.onChange,
                    WARNING_COUNT.MIN,
                  )}
                  status={errors.reclaimWarningCount ? "error" : undefined}
                  disabled={!enabled}
                  width="100%"
                  height="30px"
                  min={WARNING_COUNT.MIN}
                  controls={true}
                />
              </StyledLastFormItem>
            )}
          />
        </TwoColumnRow>
      </JobSection>
    );
  };

  return (
    <Modal
      type="primary"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      title="리소스 회수 기준 설정"
      icon={<Icon name="Edit02" color="#fff" size={20} />}
      modalWidth={368}
      centered
      okText="저장"
      cancelText="취소"
      maskClosable={!isPending}
      okButtonProps={{
        loading: isPending,
        disabled: isLoadingPolicies,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <Form layout="vertical" colon={false}>
        <FormContent>
          {renderJobSection(
            RECLAIM_POLICY_JOB_TYPES.BATCH,
            batchForm,
            batchErrors,
            batchEnabled,
            setBatchEnabled,
          )}
          {renderJobSection(
            RECLAIM_POLICY_JOB_TYPES.INTERACTIVE,
            interactiveForm,
            interactiveErrors,
            interactiveEnabled,
            setInteractiveEnabled,
          )}
        </FormContent>
      </Form>
    </Modal>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const JobSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e1e4e7;
  border-radius: 2px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SectionTitle = styled(Typography.Text).attrs({
  variant: "subtitle-2-1",
})``;

const ThreeColumnRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  position: relative;

`;

const MetricsErrorMessage = styled.div`
  ${errorTextStyle}
  position: absolute;
  bottom: -4px;

`;

const TwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
`;

const FieldLabel = styled.span`
  font-weight: 600;
  font-size: 12px;
`;

const FieldLabelSub = styled.span`
  font-size: 10px;
  color: var(--color-gray-05);
`;

const LabelWithTooltip = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StyledFormItem = styled(FormItem)`
  .ant-form-item-label > label::after {
    margin-inline-start: 0 !important;
    margin-inline-end: 0 !important;
  }
`;

const StyledLastFormItem = styled(LastFormItem)`
  .ant-form-item-label > label::after {
    margin-inline-start: 0 !important;
    margin-inline-end: 0 !important;
  }
`;
