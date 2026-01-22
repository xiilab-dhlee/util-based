"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, FormItem, Icon, Input, Modal, TextArea } from "xiilab-ui";

import { getGetPrivateImageTagListQueryKey } from "@/api/generated/private-registry/private-registry";
import { getGetPublicImageTagListQueryKey } from "@/api/generated/public-registry/public-registry";
import { CredentialSelect } from "@/domain/credential/components/credential-select";
import { useCreateRegistryTagByMode } from "@/domain/registry/hooks/use-create-registry-tag-by-mode";
import {
  type CreateRegistryTagFormType,
  createRegistryTagSchema,
} from "@/domain/registry/schemas/create-registry-tag.schema";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface CreateRegistryTagModalProps {
  mode: RegistryMode;
}

export function CreateRegistryTagModal({ mode }: CreateRegistryTagModalProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateRegistryTagFormType>({
    resolver: zodResolver(createRegistryTagSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useCreateRegistryTagByMode(mode);

  const onSubmit = (data: CreateRegistryTagFormType) => {
    if (isPending) return;

    mutate(
      {
        data,
      },
      {
        onSuccess: () => {
          // private/public 캐시 모두 무효화
          queryClient.invalidateQueries({
            queryKey: getGetPrivateImageTagListQueryKey(),
          });
          queryClient.invalidateQueries({
            queryKey: getGetPublicImageTagListQueryKey(),
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

  // filter에서 전달받은 데이터 구독 및 모달 열기
  useSubscribe(
    REGISTRY_EVENTS.openCreateTagModal,
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
