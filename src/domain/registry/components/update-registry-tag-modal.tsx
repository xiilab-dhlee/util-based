"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, Icon, Modal, TextArea } from "xiilab-ui";

import { getGetPrivateImageTagDetailQueryKey } from "@/api/generated/private-registry/private-registry";
import { getGetPublicImageTagDetailQueryKey } from "@/api/generated/public-registry/public-registry";
import { useUpdateRegistryTagByMode } from "@/domain/registry/hooks/use-update-registry-tag-by-mode";
import {
  type UpdateRegistryTagFormType,
  updateRegistryTagSchema,
} from "@/domain/registry/schemas/update-registry-tag.schema";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { LastFormItem } from "@/styles/layers/form-layer.styled";

interface UpdateRegistryTagModalProps {
  mode: RegistryMode;
}

interface UpdateTagPayload {
  tagId: number;
  tagName: string;
  harborImageName: string;
  description: string;
}

export function UpdateRegistryTagModal({ mode }: UpdateRegistryTagModalProps) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [imageTagId, setImageTagId] = useState<number | null>(null);
  const [tagName, setTagName] = useState("");
  const [harborImageName, setHarborImageName] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateRegistryTagFormType>({
    resolver: zodResolver(updateRegistryTagSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useUpdateRegistryTagByMode(mode);

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const onSubmit = (data: UpdateRegistryTagFormType) => {
    if (isPending) return;
    if (imageTagId === null) return;

    mutate(
      {
        imageTagId,
        data,
      },
      {
        onSuccess: () => {
          if (mode === "private") {
            queryClient.invalidateQueries({
              queryKey: getGetPrivateImageTagDetailQueryKey({
                tagName,
                harborImageName,
              }),
            });
          } else if (mode === "public") {
            queryClient.invalidateQueries({
              queryKey: getGetPublicImageTagDetailQueryKey({
                tagName,
                harborImageName,
              }),
            });
          }
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<UpdateTagPayload>(
    REGISTRY_EVENTS.openEditTagModal,
    (payload) => {
      setImageTagId(payload.tagId);
      setTagName(payload.tagName || "");
      setHarborImageName(payload.harborImageName || "");
      reset({ description: payload.description || "" });
      setOpen(true);
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit02" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      title="컨테이너 이미지 태그 수정"
      showCancelButton
      onCancel={handleCancel}
      okText="수정"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <Form onFinish={handleSubmit(onSubmit)}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <LastFormItem
              label="설명"
              htmlFor="registryTagDescription"
              validateStatus={errors.description ? "error" : undefined}
              help={errors.description?.message}
            >
              <TextArea
                {...field}
                id="registryTagDescription"
                placeholder="태그에 대한 설명을 입력해 주세요."
                width="100%"
              />
            </LastFormItem>
          )}
        />
      </Form>
    </Modal>
  );
}
