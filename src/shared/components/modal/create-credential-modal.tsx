"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
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
import { CREDENTIAL_SELECTOR } from "@/shared/constants/selector.constant";
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
      registryUrl: "",
      userId: "",
      token: "",
    },
  });

  const selectedType = watch("type");

  const onSubmit = (data: CreateCredentialFormType) => {
    createCredential.mutate(data, {
      onSuccess: () => {
        toast.success("크리덴셜 생성 성공");
        handleClose();
      },
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
      data-testid={CREDENTIAL_SELECTOR.CREATE_MODAL}
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
                data-testid={CREDENTIAL_SELECTOR.TYPE_FIELD}
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
        {selectedType === "DOCKER" && (
          <Controller
            name="registryUrl"
            control={control}
            render={({ field }) => (
              <FormItem
                label="Private Registry URL"
                validateStatus={errors.registryUrl ? "error" : undefined}
                htmlFor="credentialInternalRegistryUrl"
                help={errors.registryUrl?.message}
                data-testid={CREDENTIAL_SELECTOR.REGISTRY_URL_FIELD}
              >
                <Input
                  {...field}
                  type="text"
                  id="credentialInternalRegistryUrl"
                  placeholder="https://index.docker.io/v1/"
                  width="100%"
                  data-testid={CREDENTIAL_SELECTOR.REGISTRY_URL_INPUT}
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
              data-testid={CREDENTIAL_SELECTOR.USER_ID_FIELD}
            >
              <Input
                {...field}
                type="text"
                id="credentialId"
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
                type="text"
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

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;
