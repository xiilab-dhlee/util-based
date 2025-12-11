"use client";

import { useEffect } from "react";
import styled from "styled-components";
import { Box, Form, Icon, InputNumber, Modal, Typography } from "xiilab-ui";

import { REVOKE_CRITERIA } from "@/domain/revoke/constants/revoke-history.constant";
import { useGetRevokeCriteria } from "@/domain/revoke/hooks/use-get-revoke-criteria";
import { useRevokeCriteriaForm } from "@/domain/revoke/hooks/use-revoke-criteria-form";
import { useUpdateRevokeCriteria } from "@/domain/revoke/hooks/use-update-revoke-criteria";
import { openResourceRevokeCriteriaModalAtom } from "@/domain/revoke/state/revoke-history.atom";
import { getJobTypeLabel } from "@/domain/workload/constants/workload.constant";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

const { Item: FormItem } = Form;

/**
 * 리소스 회수 기준 설정 모달
 *
 * Figma 디자인에 따라 구현된 리소스 회수 기준 설정 모달입니다.
 * - Batch Job과 Interactive Job 섹션을 모두 표시
 * - GPU, Memory, CPU 임계값 입력 (% 미만) - 가로 3열 배치
 * - 최적화 기준 선택 (OR/AND)
 * - 운영시간, 경고 횟수 입력 - 가로 2열 배치
 */
export function ResourceRevokeCriteriaModal() {
  const { open, onClose } = useGlobalModal(openResourceRevokeCriteriaModalAtom);
  const { data: criteriaList, isLoading: isLoadingCriteriaList } =
    useGetRevokeCriteria();
  const updateCriteria = useUpdateRevokeCriteria();

  // 커스텀 훅 사용
  const { formState, errors, setField, validate, initializeForEdit } =
    useRevokeCriteriaForm();

  // 모달이 열릴 때 데이터 초기화
  useEffect(() => {
    if (open && criteriaList) {
      initializeForEdit(criteriaList);
    }
  }, [open, criteriaList, initializeForEdit]);

  const handleOk = () => {
    // 두 폼 검증
    const result = validate();

    if (!result) {
      // 검증 실패 - 에러는 이미 훅에서 설정됨
      return;
    }

    // 두 폼 모두 저장
    updateCriteria.mutate(result, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleCancel = () => {
    onClose();
  };

  const renderJobSection = (jobType: "BATCH" | "INTERACTIVE") => {
    const form = formState[jobType];
    const sectionErrors = errors[jobType];

    return (
      <JobSection>
        <SectionTitle>{getJobTypeLabel(jobType)} Job</SectionTitle>
        {/* GPU, CPU, Memory - 가로 3열 */}
        <ThreeColumnRow>
          <StyledFormItem
            label={
              <FieldLabel>
                GPU <FieldLabelSub>(% 미만)</FieldLabelSub>
              </FieldLabel>
            }
          >
            <InputNumber
              value={form.gpuThreshold}
              onChange={(value) =>
                setField(jobType, "gpuThreshold", String(value ?? ""))
              }
              status={sectionErrors?.gpuThreshold ? "error" : undefined}
              width="100%"
              height="30px"
              min={1}
              max={100}
              controls={true}
            />
          </StyledFormItem>

          <StyledFormItem
            label={
              <FieldLabel>
                CPU <FieldLabelSub>(% 미만)</FieldLabelSub>
              </FieldLabel>
            }
          >
            <InputNumber
              value={form.cpuThreshold}
              onChange={(value) =>
                setField(jobType, "cpuThreshold", String(value ?? ""))
              }
              status={sectionErrors?.cpuThreshold ? "error" : undefined}
              width="100%"
              height="30px"
              min={1}
              max={100}
              controls={true}
            />
          </StyledFormItem>

          <StyledFormItem
            label={
              <FieldLabel>
                Memory <FieldLabelSub>(% 미만)</FieldLabelSub>
              </FieldLabel>
            }
          >
            <InputNumber
              value={form.memoryThreshold}
              onChange={(value) =>
                setField(jobType, "memoryThreshold", String(value ?? ""))
              }
              status={sectionErrors?.memoryThreshold ? "error" : undefined}
              width="100%"
              height="30px"
              min={1}
              max={100}
              controls={true}
            />
          </StyledFormItem>
        </ThreeColumnRow>

        {/* 최적화 기준 */}
        <StyledFormItem label={<FieldLabel>최적화 기준</FieldLabel>}>
          <CriteriaButtonGroup>
            <Box
              state={
                form.revokeCriteria === REVOKE_CRITERIA.OR
                  ? "pressed"
                  : "default"
              }
              onClick={() =>
                setField(jobType, "revokeCriteria", REVOKE_CRITERIA.OR)
              }
            >
              {REVOKE_CRITERIA.OR}
            </Box>
            <Box
              state={
                form.revokeCriteria === REVOKE_CRITERIA.AND
                  ? "pressed"
                  : "default"
              }
              onClick={() =>
                setField(jobType, "revokeCriteria", REVOKE_CRITERIA.AND)
              }
            >
              {REVOKE_CRITERIA.AND}
            </Box>
          </CriteriaButtonGroup>
        </StyledFormItem>

        {/* 운영시간, 경고 횟수 - 가로 2열 */}
        <TwoColumnRow>
          <StyledFormItem
            label={
              <FieldLabel>
                운영시간 <FieldLabelSub>(시간)</FieldLabelSub>
              </FieldLabel>
            }
          >
            <InputNumber
              value={form.operationHours}
              onChange={(value) =>
                setField(jobType, "operationHours", String(value ?? ""))
              }
              status={sectionErrors?.operationHours ? "error" : undefined}
              width="100%"
              height="30px"
              min={1}
              max={999}
              controls={true}
            />
          </StyledFormItem>

          <StyledFormItem
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
          >
            <InputNumber
              value={form.warningCount}
              onChange={(value) =>
                setField(jobType, "warningCount", String(value ?? ""))
              }
              status={sectionErrors?.warningCount ? "error" : undefined}
              width="100%"
              height="30px"
              min={1}
              max={999}
              controls={true}
            />
          </StyledFormItem>
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
      okButtonProps={{
        loading: updateCriteria.isPending,
        disabled: isLoadingCriteriaList,
      }}
    >
      <Form layout="vertical" colon={false}>
        <FormContent>
          {renderJobSection("BATCH")}
          {renderJobSection("INTERACTIVE")}
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

const SectionTitle = styled(Typography.Text).attrs({
  variant: "subtitle-2-1",
})`
  margin-bottom: 16px;
`;

const ThreeColumnRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
`;

const TwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
`;

const CriteriaButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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
