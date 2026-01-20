"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
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
  TextArea,
} from "xiilab-ui";

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
import { CREDENTIAL_EVENTS } from "@/shared/constants/pubsub.constant";
import { CREDENTIAL_SELECTOR } from "@/shared/constants/selector.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

const DEFAULT_FORM_VALUES: CreateCredentialFormType = {
  credentialType: CredentialListItemResponseCredentialType.GIT_REPOSITORY,
  credentialName: "",
  description: "",
  credentialAccountId: "",
  token: "",
};

export function CreateCredentialModal() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accountId = session?.user?.id ?? "";

  const [open, setOpen] = useState(false);
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
          setOpen(false);
        },
      },
    );
  };

  const handleCancel = () => {
    if (isPending) return;

    setOpen(false);
  };

  useSubscribe(CREDENTIAL_EVENTS.openCreateModal, () => {
    reset(DEFAULT_FORM_VALUES);
    setOpen(true);
  });

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="크리덴셜 추가"
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="추가"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: !accountId,
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
      data-testid={CREDENTIAL_SELECTOR.CREATE_MODAL}
    >
      <StyledForm>
        <Controller
          name="credentialType"
          control={control}
          render={({ field }) => (
            <FormItem
              label="타입"
              required
              validateStatus={errors.credentialType ? "error" : undefined}
              help={errors.credentialType?.message}
              data-testid={CREDENTIAL_SELECTOR.TYPE_FIELD}
            >
              <Dropdown
                options={CREDENTIAL_TYPE_OPTIONS}
                onChange={(value) => field.onChange(value)}
                value={field.value}
                width="100%"
                placeholder="타입을 선택해 주세요."
                status={errors.credentialType ? "error" : undefined}
              />
            </FormItem>
          )}
        />
        <Controller
          name="credentialName"
          control={control}
          render={({ field }) => (
            <FormItem
              label="이름"
              required
              validateStatus={errors.credentialName ? "error" : undefined}
              htmlFor="credentialName"
              help={errors.credentialName?.message}
              data-testid={CREDENTIAL_SELECTOR.NAME_FIELD}
            >
              <Input
                {...field}
                type="text"
                id="credentialName"
                placeholder="이름을 입력해 주세요."
                width="100%"
                autoComplete="off"
                data-testid={CREDENTIAL_SELECTOR.NAME_INPUT}
              />
            </FormItem>
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <FormItem
              label="설명"
              validateStatus={errors.description ? "error" : undefined}
              htmlFor="credentialDescription"
              help={errors.description?.message}
              data-testid={CREDENTIAL_SELECTOR.DESCRIPTION_FIELD}
            >
              <TextArea
                {...field}
                id="credentialDescription"
                placeholder="설명을 입력해 주세요."
                data-testid={CREDENTIAL_SELECTOR.DESCRIPTION_INPUT}
              />
            </FormItem>
          )}
        />
        <Controller
          name="credentialAccountId"
          control={control}
          render={({ field }) => (
            <FormItem
              label="아이디"
              required
              validateStatus={errors.credentialAccountId ? "error" : undefined}
              htmlFor="credentialAccountId"
              help={errors.credentialAccountId?.message}
              data-testid={CREDENTIAL_SELECTOR.USER_ID_FIELD}
            >
              <Input
                {...field}
                type="text"
                id="credentialAccountId"
                placeholder="아이디를 입력해 주세요."
                width="100%"
                autoComplete="off"
                data-testid={CREDENTIAL_SELECTOR.USER_ID_INPUT}
              />
            </FormItem>
          )}
        />
        <Controller
          name="token"
          control={control}
          render={({ field }) => (
            <FormItem
              label="토큰"
              required
              validateStatus={errors.token ? "error" : undefined}
              htmlFor="credentialToken"
              help={errors.token?.message}
              data-testid={CREDENTIAL_SELECTOR.TOKEN_FIELD}
            >
              <Input
                {...field}
                type="password"
                id="credentialToken"
                placeholder="토큰을 입력해 주세요."
                width="100%"
                autoComplete="off"
                data-testid={CREDENTIAL_SELECTOR.TOKEN_INPUT}
              />
            </FormItem>
          )}
        />
      </StyledForm>
    </Modal>
  );
}

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 16px;

  --icon-fill: #969a9f;
`;
