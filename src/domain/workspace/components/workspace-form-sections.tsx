"use client";

import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import styled from "styled-components";
import { FormItem, Input, TextArea, Typography } from "xiilab-ui";

import type { WorkspaceResourceRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { WORKSPACE_DESCRIPTION_MAX_LENGTH } from "@/domain/workspace/constants/workspace-validation.constant";
import type { CreateWorkspaceFormType } from "@/domain/workspace/utils/create-workspace-form.override.zod";
import { ResourceSummaryCard } from "@/shared/components/resource-summary-card";
import { subTitleStyle } from "@/styles/mixins/text";

interface WorkspaceResourceSectionProps {
  resource: WorkspaceResourceRequest | undefined;
}

interface WorkspaceInfoSectionProps {
  control: Control<CreateWorkspaceFormType>;
  errors: FieldErrors<CreateWorkspaceFormType>;
  isPending?: boolean;
}

export function WorkspaceResourceSection({
  resource,
}: WorkspaceResourceSectionProps) {
  return (
    <Section>
      <SectionTitle>리소스</SectionTitle>
      <ResourceSummaryCard resource={resource} />
    </Section>
  );
}

export function WorkspaceInfoSection({
  control,
  errors,
  isPending = false,
}: WorkspaceInfoSectionProps) {
  return (
    <Section>
      <SectionTitle>워크스페이스 정보</SectionTitle>

      <Controller
        name="workspaceName"
        control={control}
        render={({ field }) => (
          <FormItem
            label="이름"
            htmlFor="workspace-name"
            required
            validateStatus={errors.workspaceName ? "error" : undefined}
            help={errors.workspaceName?.message}
          >
            <Input
              {...field}
              value={field.value ?? ""}
              id="workspace-name"
              type="text"
              placeholder="워크스페이스 이름을 입력해 주세요."
              maxLength={50}
              width="100%"
              disabled={isPending}
            />
          </FormItem>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <LastFormItem
            label="설명"
            validateStatus={errors.description ? "error" : undefined}
            help={errors.description?.message}
            htmlFor="workspace-description"
          >
            <FixedHeightTextArea
              {...field}
              value={field.value ?? ""}
              placeholder="워크스페이스 설명을 입력해 주세요."
              maxLength={WORKSPACE_DESCRIPTION_MAX_LENGTH}
              disabled={isPending}
              id="workspace-description"
            />
          </LastFormItem>
        )}
      />
    </Section>
  );
}

// Styled Components
const Section = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled(Typography.Text).attrs({
  variant: "body-2-1",
})`
  ${subTitleStyle(0)}
  padding-left: 4px;
  margin-bottom: 8px;
`;

const FixedHeightTextArea = styled(TextArea)`
  && {
    height: 110px;
    resize: none;
  }
`;

const LastFormItem = styled(FormItem)`
  && {
    margin-bottom: 0;
  }
`;
