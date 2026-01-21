"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Dropdown, Form, FormItem, Icon, Input, Modal } from "xiilab-ui";

import type { GetPrivateRegistryListImageSourceType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { getGetPrivateRegistryListQueryKey } from "@/api/generated/private-registry/private-registry";
import { getGetPublicRegistryListQueryKey } from "@/api/generated/public-registry/public-registry";
import { CredentialSelect } from "@/domain/credential/components/credential-select";
// import { SelectWorkloadForSnapshot } from "@/domain/registry/components/select-workload-for-snapshot";
import { REGISTRY_CHANNEL_OPTIONS } from "@/domain/registry/constants/registry-list.constant";
import { useCreateRegistryByMode } from "@/domain/registry/hooks/use-create-registry-by-mode";
import {
  type CreateRegistryFormType,
  createRegistrySchema,
} from "@/domain/registry/schemas/create-registry.schema";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { FormRow } from "@/styles/layers/form-layer.styled";

interface CreateRegistryModalProps {
  mode: RegistryMode;
}

export function CreateRegistryModal({ mode }: CreateRegistryModalProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  // const [type, setType] =
  //   useState<GetPrivateRegistryListImageSourceType>("SNAPSHOT");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateRegistryFormType>({
    resolver: zodResolver(createRegistrySchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useCreateRegistryByMode(mode);

  const handleChangeCredential = (value: number | null) => {
    if (value === null) return;
    setValue("credentialId", value, { shouldValidate: true });
  };

  const onSubmit = (data: CreateRegistryFormType) => {
    if (!selectedWorkspace) return;

    mutate(
      {
        data: {
          ...data,
          workspaceId: selectedWorkspace.workspaceId,
        },
      },
      {
        onSuccess: () => {
          // private/public 캐시 모두 무효화
          queryClient.invalidateQueries({
            queryKey: getGetPrivateRegistryListQueryKey(),
          });
          queryClient.invalidateQueries({
            queryKey: getGetPublicRegistryListQueryKey(),
          });
          toast.success("레지스트리 이미지가 생성되었습니다.");
          setOpen(false);
        },
      },
    );
  };

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  // 구분 선택 카드에서 전달받은 구분 타입 구독 및 모달 열기
  useSubscribe(
    PRIVATE_REGISTRY_EVENTS.openCreateModal,
    (type: GetPrivateRegistryListImageSourceType) => {
      // setType(type);
      // 폼 초기화 후 type 설정
      reset({
        imageName: "",
        imageTagName: "",
        registryChannel: undefined,
        credentialId: undefined,
      });
      setOpen(true);
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={580}
      open={open}
      closable
      title="컨테이너 이미지 생성"
      showCancelButton
      onCancel={handleCancel}
      okText="생성"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: !isValid,
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
        {/* {type === "SNAPSHOT" && (
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
                <SelectWorkloadForSnapshot
                  checkedWorkload={field.value ?? null}
                  setCheckedWorkload={(value) => {
                    setValue("workloadId", value ?? "", {
                      shouldValidate: true,
                    });
                  }}
                />
              </FormItem>
            )}
          />
        )} */}
      </Form>
    </Modal>
  );
}
