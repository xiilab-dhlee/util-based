"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

import { CREDENTIAL_TYPE_OPTIONS } from "@/domain/credential/constants/credential.constant";
import { useCreateCredential } from "@/domain/credential/hooks/use-create-credential";
import {
  type CreateCredentialFormType,
  createCredentialFormSchema,
} from "@/domain/credential/schemas/credential.schema";
import type { CredentialType } from "@/domain/credential/types/credential.type";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { openCreateCredentialModalAtom } from "@/shared/state/modal.atom";

/**
 * 크리덴셜 생성 모달 컴포넌트
 *
 * react-hook-form과 zod를 사용한 유효성 검증을 제공합니다.
 *
 * 유효성 검증 규칙:
 * - 타입: 필수 (GIT 또는 DOCKER)
 * - 이름: 필수, 최대 100자
 * - 설명: 선택, 최대 500자
 * - 내부 레지스트리 URL: DOCKER 타입일 때만 표시, URL 형식
 * - 아이디: 필수
 * - 토큰: 필수
 */
export function CreateCredentialModal() {
  const { open, onClose } = useGlobalModal(openCreateCredentialModalAtom);
  const createCredential = useCreateCredential();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateCredentialFormType>({
    resolver: zodResolver(createCredentialFormSchema),
    defaultValues: {
      type: "GIT",
      name: "",
      description: "",
      internalRegistryUrl: "",
      userId: "",
      token: "",
    },
  });

  const selectedType = watch("type");

  const onSubmit = (data: CreateCredentialFormType) => {
    createCredential.mutate({
      type: data.type as CredentialType,
      name: data.name,
      description: data.description || "",
      internalregistryUrl: data.internalRegistryUrl || "",
      id: data.userId,
      pw: data.token,
    });
  };

  const handleClose = () => {
    onClose();
  };

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
      onCancel={handleClose}
      okText="추가"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: createCredential.isPending,
      }}
      afterClose={reset}
    >
      <StyledForm>
        <NameRow>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormItem
                label="타입"
                required
                validateStatus={errors.type ? "error" : undefined}
                help={errors.type?.message}
              >
                <Dropdown
                  options={CREDENTIAL_TYPE_OPTIONS}
                  onChange={(value) => field.onChange(value)}
                  value={field.value}
                  width="100%"
                  placeholder="타입을 선택해 주세요."
                  status={errors.type ? "error" : undefined}
                />
              </FormItem>
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <FormItem
                label="이름"
                required
                validateStatus={errors.name ? "error" : undefined}
                htmlFor="credentialName"
                help={errors.name?.message}
              >
                <Input
                  {...field}
                  type="text"
                  id="credentialName"
                  placeholder="이름을 입력해 주세요."
                  width="100%"
                  autoComplete="off"
                />
              </FormItem>
            )}
          />
        </NameRow>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <FormItem
              label="설명"
              validateStatus={errors.description ? "error" : undefined}
              htmlFor="credentialDescription"
              help={errors.description?.message}
            >
              <TextArea
                {...field}
                id="credentialDescription"
                placeholder="설명을 입력해 주세요."
              />
            </FormItem>
          )}
        />
        {selectedType === "DOCKER" && (
          <Controller
            name="internalRegistryUrl"
            control={control}
            render={({ field }) => (
              <FormItem
                label="내부 레지스트리 URL"
                validateStatus={
                  errors.internalRegistryUrl ? "error" : undefined
                }
                htmlFor="credentialInternalRegistryUrl"
                help={errors.internalRegistryUrl?.message}
              >
                <Input
                  {...field}
                  type="text"
                  id="credentialInternalRegistryUrl"
                  placeholder="https://index.docker.io/v1/"
                  width="100%"
                />
              </FormItem>
            )}
          />
        )}
        <Controller
          name="userId"
          control={control}
          render={({ field }) => (
            <FormItem
              label="아이디"
              required
              validateStatus={errors.userId ? "error" : undefined}
              htmlFor="credentialId"
              help={errors.userId?.message}
            >
              <Input
                {...field}
                type="text"
                id="credentialId"
                placeholder="아이디를 입력해 주세요."
                width="100%"
                autoComplete="off"
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
            >
              <Input
                {...field}
                type="text"
                id="credentialToken"
                placeholder="토큰을 입력해 주세요."
                width="100%"
                autoComplete="off"
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

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;
