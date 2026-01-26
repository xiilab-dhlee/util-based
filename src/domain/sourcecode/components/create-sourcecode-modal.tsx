"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import {
  Dropdown,
  Form,
  FormItem,
  Icon,
  Input,
  Modal,
  Switch,
} from "xiilab-ui";

import {
  getGetSourceCodeListQueryKey,
  useRegisterSourceCode,
} from "@/api/generated/source-code/source-code";
import { CredentialSelect } from "@/domain/credential/components/credential-select";
import { SourcecodeParameterFormField } from "@/domain/sourcecode/components/sourcecode-parameter-form-field";
import { SOURCECODE_TYPE_OPTIONS } from "@/domain/sourcecode/constants/sourcecode.constant";
import { useSourcecodeParameters } from "@/domain/sourcecode/hooks/use-sourcecode-parameters";
import {
  type CreateSourcecodeFormType,
  createSourcecodeSchema,
} from "@/domain/sourcecode/schemas/sourcecode.schema";
import { CustomScrollbars } from "@/shared/components/custom-scrollbars";
import { FormLabel } from "@/shared/components/form/form-label";
import { VISIBILITY_STATUS_OPTIONS } from "@/shared/constants/core.constant";
import { SOURCECODE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { FormRow } from "@/styles/layers/form-layer.styled";

export function CreateSourcecodeModal() {
  const queryClient = useQueryClient();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  const [open, setOpen] = useState(false);
  const [credentialEnabled, setCredentialEnabled] = useState(false);

  const {
    parameters,
    addParameter,
    updateParameter,
    removeParameter,
    resetParameters,
    toRecord,
  } = useSourcecodeParameters();

  const { mutate, isPending } = useRegisterSourceCode();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateSourcecodeFormType>({
    resolver: zodResolver(createSourcecodeSchema),
    defaultValues: {
      sourceCodeName: "",
      gitUrl: "",
      sourceCodeType: "GITHUB",
      mountPath: "",
      executionCmd: "",
      isPublic: "true",
      credentialId: null,
      parameter: {},
    },
  });

  const credentialId = watch("credentialId");

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const handleCredentialToggle = () => {
    setValue("credentialId", null);
    setCredentialEnabled((prev) => !prev);
  };

  const onSubmit = (data: CreateSourcecodeFormType) => {
    if (isPending) return;
    if (!selectedWorkspace) return;

    mutate(
      {
        data: {
          sourceCodeName: data.sourceCodeName,
          gitUrl: data.gitUrl,
          sourceCodeType: data.sourceCodeType,
          mountPath: data.mountPath,
          executionCmd: data.executionCmd || "",
          isPublic: data.isPublic === "true",
          credentialId: data.credentialId ?? undefined,
          parameter: toRecord(),
          workspaceId: selectedWorkspace.workspaceId,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetSourceCodeListQueryKey(),
          });
          setOpen(false);
        },
      },
    );
  };

  useSubscribe(SOURCECODE_EVENTS.openCreateModal, () => {
    reset();
    setCredentialEnabled(false);
    resetParameters();
    setOpen(true);
  });

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={580}
      open={open}
      closable
      title="소스코드 생성"
      onCancel={handleCancel}
      showCancelButton
      cancelText="취소"
      okText="생성"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      okButtonProps={{ disabled: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <ScrollWrapper>
        <CustomScrollbars>
          <StyledForm layout="vertical">
            {/* 소스코드 이름 & 공개 설정 */}
            <StyledFormRow>
              <Controller
                name="sourceCodeName"
                control={control}
                render={({ field }) => (
                  <StyledFormItem
                    label="소스코드 이름"
                    required
                    validateStatus={errors.sourceCodeName ? "error" : undefined}
                    help={errors.sourceCodeName?.message}
                  >
                    <Input
                      {...field}
                      placeholder="소스코드 이름을 입력해 주세요."
                      width="100%"
                      disabled={isPending}
                      autoComplete="off"
                      maxLength={50}
                    />
                  </StyledFormItem>
                )}
              />
              <Controller
                name="isPublic"
                control={control}
                render={({ field }) => (
                  <StyledFormItem
                    label="공개 설정"
                    required
                    validateStatus={errors.isPublic ? "error" : undefined}
                    help={errors.isPublic?.message}
                  >
                    <Dropdown
                      options={VISIBILITY_STATUS_OPTIONS}
                      value={field.value || null}
                      onChange={(value) => field.onChange(value)}
                      width="100%"
                      status={errors.isPublic ? "error" : undefined}
                      disabled={isPending}
                    />
                  </StyledFormItem>
                )}
              />
            </StyledFormRow>

            {/* Git URL */}
            <StyledFormRow>
              <Controller
                name="sourceCodeType"
                control={control}
                render={({ field }) => (
                  <StyledFormItem
                    label="Git URL"
                    required
                    validateStatus={errors.sourceCodeType ? "error" : undefined}
                    help={errors.sourceCodeType?.message}
                  >
                    <Dropdown
                      options={SOURCECODE_TYPE_OPTIONS}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      width="100%"
                      disabled={isPending}
                    />
                  </StyledFormItem>
                )}
              />
              <Controller
                name="gitUrl"
                control={control}
                render={({ field }) => (
                  <StyledFormItem
                    label=" "
                    validateStatus={errors.gitUrl ? "error" : undefined}
                    help={errors.gitUrl?.message}
                  >
                    <Input
                      {...field}
                      placeholder="http://github.com/astrago-ai"
                      width="100%"
                      disabled={isPending}
                      maxLength={1000}
                      autoComplete="off"
                    />
                  </StyledFormItem>
                )}
              />
            </StyledFormRow>

            {/* 크리덴셜 */}
            <CredentialRow>
              <CredentialLabel>
                <FormLabel>크리덴셜</FormLabel>
                <Switch
                  checked={credentialEnabled}
                  onChange={handleCredentialToggle}
                  disabled={isPending}
                />
              </CredentialLabel>
              {credentialEnabled && (
                <CredentialSelect
                  value={credentialId ?? null}
                  setValue={(value) => setValue("credentialId", value)}
                />
              )}
            </CredentialRow>
            {/* 기본 마운트 경로 & 실행 명령어 */}
            <StyledFormRow>
              <Controller
                name="mountPath"
                control={control}
                render={({ field }) => (
                  <StyledFormItem
                    label="기본 Mount Path"
                    required
                    validateStatus={errors.mountPath ? "error" : undefined}
                    help={errors.mountPath?.message}
                  >
                    <Input
                      {...field}
                      placeholder="Mount Path를 입력해 주세요."
                      width="100%"
                      disabled={isPending}
                      maxLength={1000}
                      autoComplete="off"
                    />
                  </StyledFormItem>
                )}
              />
              <Controller
                name="executionCmd"
                control={control}
                render={({ field }) => (
                  <StyledFormItem
                    label="실행 명령어"
                    validateStatus={errors.executionCmd ? "error" : undefined}
                    help={errors.executionCmd?.message}
                    required
                  >
                    <Input
                      {...field}
                      placeholder="실행 명령어를 입력해 주세요."
                      width="100%"
                      disabled={isPending}
                      maxLength={1000}
                      autoComplete="off"
                    />
                  </StyledFormItem>
                )}
              />
            </StyledFormRow>

            {/* 파라미터 */}
            <ParameterSection>
              <FormLabel>파라미터</FormLabel>
              <SourcecodeParameterFormField
                value={parameters}
                onAdd={addParameter}
                onUpdate={updateParameter}
                onRemove={removeParameter}
                disabled={isPending}
              />
            </ParameterSection>
          </StyledForm>
        </CustomScrollbars>
      </ScrollWrapper>
    </Modal>
  );
}

const ScrollWrapper = styled.div`
  height: 510px;
  position: relative;
`;

const StyledForm = styled(Form)``;

const StyledFormRow = styled(FormRow)`
  gap: 8px;
`;

const StyledFormItem = styled(FormItem)`
  margin-bottom: 10px !important;
`;

const CredentialRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
`;

const CredentialLabel = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

const ParameterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
