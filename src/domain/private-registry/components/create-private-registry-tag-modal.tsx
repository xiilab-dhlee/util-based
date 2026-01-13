"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Form, FormItem, Icon, Input, Modal, TextArea } from "xiilab-ui";

import type { RegistryDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetPrivateImageTagListQueryKey,
  useAddImageTag1,
} from "@/api/generated/private-registry/private-registry";
import { CredentialSelect } from "@/domain/credential/components/credential-select";
import {
  type CreatePrivateRegistryTagFormType,
  createPrivateRegistryTagSchema,
} from "@/domain/private-registry/schemas/create-private-registry-tag.schema";
import { openCreatePrivateRegistryTagModalAtom } from "@/domain/private-registry/state/private-registry.atom";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function CreatePrivateRegistryTagModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openCreatePrivateRegistryTagModalAtom,
  );
  const queryClient = useQueryClient();

  // filter에서 전달받은 harborImageName
  const [harborImageName, setHarborImageName] = useState<string>("");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreatePrivateRegistryTagFormType>({
    resolver: zodResolver(createPrivateRegistryTagSchema),
    mode: "onChange",
    defaultValues: {
      imageTagName: "",
      registryChannel: undefined,
      credentialId: undefined,
      description: "",
    },
  });

  // filter에서 전달받은 데이터 구독 및 모달 열기
  useSubscribe(
    PRIVATE_REGISTRY_EVENTS.sendCreateTagData,
    (data: RegistryDetailResponse) => {
      // setHarborImageName(data.harborImageName);
      reset({
        imageTagName: "",
        registryChannel: undefined,
        credentialId: undefined,
        description: "",
      });
      onOpen();
    },
  );

  const { mutate: addImageTag, isPending } = useAddImageTag1();

  const onSubmit = (data: CreatePrivateRegistryTagFormType) => {
    if (!harborImageName) {
      toast.error("이미지 정보를 찾을 수 없습니다.");
      return;
    }

    addImageTag(
      {
        data: {
          harborImageName,
          imageTagName: data.imageTagName,
          registryChannel: data.registryChannel,
          credentialId: data.credentialId,
          description: data.description,
        },
      },
      {
        onSuccess: () => {
          toast.success("이미지 태그가 추가되었습니다.");
          queryClient.invalidateQueries({
            queryKey: getGetPrivateImageTagListQueryKey(),
          });
          handleClose();
        },
        onError: () => {
          toast.error("이미지 태그 추가에 실패했습니다.");
        },
      },
    );
  };

  const handleClose = () => {
    reset();
    setHarborImageName("");
    onClose();
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={580}
      open={open}
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      title="태그 추가"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="추가"
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
          name="imageTagName"
          control={control}
          render={({ field }) => (
            <FormItem
              label="태그"
              required
              validateStatus={errors.imageTagName ? "error" : undefined}
              htmlFor="privateRegistryTagName"
              help={errors.imageTagName?.message}
            >
              <Input
                {...field}
                type="text"
                id="privateRegistryTagName"
                placeholder="태그를 입력해 주세요."
                autoComplete="off"
                width="100%"
              />
            </FormItem>
          )}
        />
        {/* <Controller
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
        /> */}
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
                setValue={(value) => {
                  if (value !== null) {
                    setValue("credentialId", value, { shouldValidate: true });
                  }
                }}
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
              help={errors.description?.message}
            >
              <TextArea
                {...field}
                placeholder="태그에 대한 설명을 입력해 주세요."
                width="100%"
              />
            </FormItem>
          )}
        />
      </Form>
    </Modal>
  );
}
