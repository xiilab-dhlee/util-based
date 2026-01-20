"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Form, FormItem, Icon, Input, Modal, TextArea } from "xiilab-ui";

import {
  getGetPrivateImageTagListQueryKey,
  useAddPrivateImageTag,
} from "@/api/generated/private-registry/private-registry";
import { CredentialSelect } from "@/domain/credential/components/credential-select";
import {
  type CreatePrivateRegistryTagFormType,
  createPrivateRegistryTagSchema,
} from "@/domain/private-registry/schemas/create-private-registry-tag.schema";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function CreatePrivateRegistryTagModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreatePrivateRegistryTagFormType>({
    resolver: zodResolver(createPrivateRegistryTagSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useAddPrivateImageTag();

  const onSubmit = (data: CreatePrivateRegistryTagFormType) => {
    if (isPending) return;

    mutate(
      {
        data,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetPrivateImageTagListQueryKey(),
          });
          toast.success("이미지 태그가 추가되었습니다.");
          setOpen(false);
        },
      },
    );
  };

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  // filter에서 전달받은 데이터 구독 및 모달 열기
  useSubscribe(
    PRIVATE_REGISTRY_EVENTS.openCreateTagModal,
    (harborImageName: string) => {
      reset({
        harborImageName,
        imageTagName: "",
        credentialId: undefined,
        description: "",
      });
      setOpen(true);
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="태그 추가"
      showCancelButton
      onCancel={handleCancel}
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
