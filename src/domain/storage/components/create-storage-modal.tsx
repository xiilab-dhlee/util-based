"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dropdown, Form, FormItem, Icon, Input, Modal } from "xiilab-ui";

import {
  getGetStoragesQueryKey,
  useRegisterStorage,
} from "@/api/generated/admin-storage/admin-storage";
import { StorageCreateRequestStorageChannel } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { STORAGE_CHANNEL_OPTIONS } from "@/domain/storage/constants/storage.constant";
import {
  type CreateStorageFormType,
  createStorageFormSchema,
} from "@/domain/storage/schemas/storage.schema";
import { STORAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { FormRow, LastFormItem } from "@/styles/layers/form-layer.styled";

export function CreateStorageModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStorageFormType>({
    resolver: zodResolver(createStorageFormSchema),
    defaultValues: {
      storageName: "",
      storageChannel: StorageCreateRequestStorageChannel.NFS,
      storageIp: "",
      storageSavePath: "",
    },
  });

  const { mutate, isPending } = useRegisterStorage();

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const onSubmit = (formData: CreateStorageFormType) => {
    if (isPending) return;

    mutate(
      {
        data: formData,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetStoragesQueryKey(),
          });
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<void>(STORAGE_EVENTS.openCreateModal, () => {
    reset();
    setOpen(true);
  });

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="스토리지 추가"
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="추가"
      onOk={handleSubmit(onSubmit)}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
      centered
      showHeaderBorder
    >
      <Form layout="vertical">
        <FormRow>
          <Controller
            name="storageName"
            control={control}
            render={({ field }) => (
              <FormItem
                label="이름"
                required
                validateStatus={errors.storageName ? "error" : undefined}
                help={errors.storageName?.message}
              >
                <Input
                  {...field}
                  placeholder="이름을 입력해 주세요."
                  autoComplete="off"
                  disabled={isPending}
                />
              </FormItem>
            )}
          />
          <Controller
            name="storageChannel"
            control={control}
            render={({ field }) => (
              <FormItem
                label="타입"
                required
                validateStatus={errors.storageChannel ? "error" : undefined}
                help={errors.storageChannel?.message}
              >
                <Dropdown
                  placeholder="타입을 선택해 주세요."
                  options={STORAGE_CHANNEL_OPTIONS}
                  value={field.value}
                  onChange={(value) => field.onChange(String(value))}
                  width="100%"
                  disabled={isPending}
                />
              </FormItem>
            )}
          />
        </FormRow>
        <Controller
          name="storageIp"
          control={control}
          render={({ field }) => (
            <FormItem
              label="IP 주소"
              required
              validateStatus={errors.storageIp ? "error" : undefined}
              help={errors.storageIp?.message}
            >
              <Input
                {...field}
                placeholder="IP 주소를 입력해 주세요."
                disabled={isPending}
                autoComplete="off"
              />
            </FormItem>
          )}
        />
        <Controller
          name="storageSavePath"
          control={control}
          render={({ field }) => (
            <LastFormItem
              label="스토리지 저장 Path"
              required
              validateStatus={errors.storageSavePath ? "error" : undefined}
              help={errors.storageSavePath?.message}
            >
              <Input
                {...field}
                placeholder="Path를 입력해 주세요. 예) /root/code/123"
                disabled={isPending}
                autoComplete="off"
              />
            </LastFormItem>
          )}
        />
      </Form>
    </Modal>
  );
}
