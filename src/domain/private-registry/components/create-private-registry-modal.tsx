"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Dropdown, Form, FormItem, Icon, Input, Modal } from "xiilab-ui";

import type { GetPrivateRegistryListImageSourceType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetPrivateRegistryListQueryKey,
  useCreatePrivateExternalImage,
} from "@/api/generated/private-registry/private-registry";
import { CredentialSelect } from "@/domain/credential/components/credential-select";
import { SelectSearchedWorkload } from "@/domain/internal-registry-image/components/list/select-searched-workload";
import { REGISTRY_CHANNEL_OPTIONS } from "@/domain/private-registry/constants/private-registry.constant";
import {
  type CreatePrivateRegistryFormType,
  createPrivateRegistrySchema,
} from "@/domain/private-registry/schemas/create-private-registry.schema";
import { openCreatePrivateRegistryModalAtom } from "@/domain/private-registry/state/private-registry.atom";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { FormRow } from "@/styles/layers/form-layer.styled";

export function CreatePrivateRegistryModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openCreatePrivateRegistryModalAtom,
  );
  const queryClient = useQueryClient();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CreatePrivateRegistryFormType>({
    resolver: zodResolver(createPrivateRegistrySchema),
    mode: "onChange",
  });

  // 폼에서 type 감시 (UI 분기용)
  const formType = watch("type");

  const { mutate: createImage, isPending } = useCreatePrivateExternalImage();

  const handleChangeCredential = (value: number | null) => {
    if (value === null) return;
    setValue("credentialId", value, { shouldValidate: true });
  };

  const onSubmit = (data: CreatePrivateRegistryFormType) => {
    if (!selectedWorkspace) {
      toast.error("워크스페이스를 선택해 주세요.");
      return;
    }

    createImage(
      {
        data: {
          ...data,
          ...(data.type === "SNAPSHOT" &&
            data.workloadId && { workloadId: data.workloadId }),
          workspaceId: selectedWorkspace.workspaceId,
        },
      },
      {
        onSuccess: () => {
          toast.success("개인 레지스트리 이미지가 생성되었습니다.");
          queryClient.invalidateQueries({
            queryKey: getGetPrivateRegistryListQueryKey(),
          });
          onClose();
        },
      },
    );
  };

  // 구분 선택 카드에서 전달받은 구분 타입 구독 및 모달 열기
  useSubscribe(
    PRIVATE_REGISTRY_EVENTS.sendType,
    (type: GetPrivateRegistryListImageSourceType) => {
      // 폼 초기화 후 type 설정
      reset({
        type,
        imageName: "",
        imageTagName: "",
        registryChannel: undefined,
        credentialId: undefined,
        ...(type === "SNAPSHOT" && { workloadId: "" }),
      });
      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={580}
      open={open}
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      title="컨테이너 이미지 생성"
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="생성"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: !isValid || isPending,
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <Form onFinish={handleSubmit(onSubmit)}>
        <Controller
          name="imageName"
          control={control}
          render={({ field }) => (
            <FormItem
              label="컨테이너 이미지 이름"
              required
              validateStatus={errors.imageName ? "error" : undefined}
              htmlFor="privateRegistryImageName"
              help={errors.imageName?.message}
            >
              <Input
                {...field}
                type="text"
                id="privateRegistryImageName"
                placeholder="컨테이너 이미지 이름을 입력해 주세요."
                autoComplete="off"
                width="100%"
              />
            </FormItem>
          )}
        />
        <FormRow>
          <Controller
            name="imageTagName"
            control={control}
            render={({ field }) => (
              <FormItem
                label="태그"
                required
                validateStatus={errors.imageTagName ? "error" : undefined}
                htmlFor="privateRegistryImageTag"
                help={errors.imageTagName?.message}
              >
                <Input
                  {...field}
                  type="text"
                  id="privateRegistryImageTag"
                  placeholder="태그를 입력해 주세요."
                  autoComplete="off"
                  width="100%"
                />
              </FormItem>
            )}
          />
          <Controller
            name="registryChannel"
            control={control}
            render={({ field }) => (
              <FormItem
                label="레지스트리 채널"
                required
                validateStatus={errors.registryChannel ? "error" : undefined}
                help={errors.registryChannel?.message}
              >
                <Dropdown
                  options={REGISTRY_CHANNEL_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="레지스트리 채널을 선택해 주세요."
                  theme="light"
                  width="100%"
                />
              </FormItem>
            )}
          />
        </FormRow>
        <FormRow>
          <Controller
            name="credentialId"
            control={control}
            render={({ field }) => (
              <FormItem
                label="크리덴셜"
                required
                validateStatus={errors.credentialId ? "error" : undefined}
                help={errors.credentialId?.message}
              >
                <CredentialSelect
                  value={field.value ?? null}
                  setValue={handleChangeCredential}
                />
              </FormItem>
            )}
          />
        </FormRow>
        {formType === "SNAPSHOT" && (
          <Controller
            name="workloadId"
            control={control}
            shouldUnregister
            render={({ field, fieldState }) => (
              <FormItem
                label="워크로드 선택"
                required
                validateStatus={fieldState.error ? "error" : undefined}
                htmlFor="workloadSelect"
                help={fieldState.error?.message}
              >
                <SelectSearchedWorkload
                  checkedWorkload={field.value ?? null}
                  setCheckedWorkload={(value) => {
                    if (typeof value === "string" || value === null) {
                      setValue("workloadId", value ?? "", {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              </FormItem>
            )}
          />
        )}
      </Form>
    </Modal>
  );
}
