"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Button, Dropdown, FormItem, Input, TextArea } from "xiilab-ui";

import { CredentialListItemResponseCredentialType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetCredentialsQueryKey,
  useCreateCredential,
} from "@/api/generated/credential/credential";
import { CREDENTIAL_TYPE_OPTIONS } from "@/domain/credential/constants/credential.constant";
import {
  type CreateCredentialFormType,
  createCredentialFormSchema,
} from "@/domain/credential/schemas/credential.schema";
import { FormRow } from "@/styles/layers/form-layer.styled";

const DEFAULT_FORM_VALUES: CreateCredentialFormType = {
  credentialType: CredentialListItemResponseCredentialType.GIT_REPOSITORY,
  credentialName: "",
  description: "",
  credentialAccountId: "",
  token: "",
};

/**
 * 크리덴셜 생성 폼 컴포넌트
 *
 * react-hook-form + zod validation 적용
 */
export function CreateCredentialForm() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accountId = session?.user?.id ?? "";

  const { mutate, isPending } = useCreateCredential();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCredentialFormType>({
    resolver: zodResolver(createCredentialFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const onSubmit = (data: CreateCredentialFormType) => {
    if (isPending) return;
    if (!accountId) return;

    mutate(
      {
        accountId,
        data,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetCredentialsQueryKey(accountId),
            exact: false,
          });
          reset(DEFAULT_FORM_VALUES);
        },
      },
    );
  };

  return (
    <Container>
      <StyledFormRow>
        <Controller
          name="credentialType"
          control={control}
          render={({ field }) => (
            <StyledFormItem
              label="타입"
              required
              validateStatus={errors.credentialType ? "error" : undefined}
              help={errors.credentialType?.message}
            >
              <Dropdown
                options={CREDENTIAL_TYPE_OPTIONS}
                onChange={(value) => field.onChange(value)}
                value={field.value}
                width="100%"
                placeholder="타입을 선택해 주세요."
                status={errors.credentialType ? "error" : undefined}
              />
            </StyledFormItem>
          )}
        />
        <Controller
          name="credentialName"
          control={control}
          render={({ field }) => (
            <StyledFormItem
              label="이름"
              required
              validateStatus={errors.credentialName ? "error" : undefined}
              htmlFor="formCredentialName"
              help={errors.credentialName?.message}
            >
              <Input
                {...field}
                type="text"
                id="formCredentialName"
                placeholder="이름을 입력해 주세요."
                width="100%"
                autoComplete="off"
              />
            </StyledFormItem>
          )}
        />
      </StyledFormRow>
      <StyledFormRow>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <StyledFormItem
              label="설명"
              validateStatus={errors.description ? "error" : undefined}
              htmlFor="formCredentialDescription"
              help={errors.description?.message}
            >
              <TextArea
                {...field}
                id="formCredentialDescription"
                placeholder="설명을 입력해 주세요."
              />
            </StyledFormItem>
          )}
        />
      </StyledFormRow>
      <StyledFormRow>
        <Controller
          name="credentialAccountId"
          control={control}
          render={({ field }) => (
            <StyledFormItem
              label="아이디"
              required
              validateStatus={errors.credentialAccountId ? "error" : undefined}
              htmlFor="formCredentialAccountId"
              help={errors.credentialAccountId?.message}
            >
              <Input
                {...field}
                type="text"
                id="formCredentialAccountId"
                placeholder="아이디를 입력해 주세요."
                width="100%"
                autoComplete="off"
              />
            </StyledFormItem>
          )}
        />
        <Controller
          name="token"
          control={control}
          render={({ field }) => (
            <StyledFormItem
              label="토큰"
              required
              validateStatus={errors.token ? "error" : undefined}
              htmlFor="formCredentialToken"
              help={errors.token?.message}
            >
              <Input
                {...field}
                type="password"
                id="formCredentialToken"
                placeholder="토큰을 입력해 주세요."
                width="100%"
                autoComplete="off"
              />
            </StyledFormItem>
          )}
        />
      </StyledFormRow>

      <Button
        variant="outlined"
        color="primary"
        icon="Plus"
        width="100%"
        height="30px"
        iconSize={20}
        onClick={handleSubmit(onSubmit)}
        disabled={!accountId}
        loading={isPending}
      >
        크리덴셜 저장
      </Button>
    </Container>
  );
}

// ===== Styled Components =====

const Container = styled.div`
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
`;

const StyledFormRow = styled(FormRow)`
  gap: 8px;
`;

const StyledFormItem = styled(FormItem)`
  flex: 1;
`;
