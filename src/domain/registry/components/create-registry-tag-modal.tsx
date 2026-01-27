"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, FormItem, Icon, Input, Modal, TextArea } from "xiilab-ui";

import { getGetPrivateImageTagListQueryKey } from "@/api/generated/private-registry/private-registry";
import { getGetPublicImageTagListQueryKey } from "@/api/generated/public-registry/public-registry";
import { CredentialSelect } from "@/domain/credential/components/credential-select";
import { checkImageTagExistsByMode } from "@/domain/registry/hooks/use-check-image-tag-exists-by-mode";
import { useCreateRegistryTagByMode } from "@/domain/registry/hooks/use-create-registry-tag-by-mode";
import {
  type CreateRegistryTagFormType,
  createRegistryTagSchema,
} from "@/domain/registry/schemas/create-registry-tag.schema";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { FormRow, LastFormItem } from "@/styles/layers/form-layer.styled";

interface CreateRegistryTagModalProps {
  mode: RegistryMode;
}

export function CreateRegistryTagModal({ mode }: CreateRegistryTagModalProps) {
  const queryClient = useQueryClient();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const [open, setOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<CreateRegistryTagFormType | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreateRegistryTagFormType>({
    resolver: zodResolver(createRegistryTagSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useCreateRegistryTagByMode(mode);

  const executeCreate = (data: CreateRegistryTagFormType) => {
    mutate(
      {
        data,
      },
      {
        onSuccess: () => {
          if (mode === "private") {
            queryClient.invalidateQueries({
              queryKey: getGetPrivateImageTagListQueryKey(),
            });
          } else if (mode === "public") {
            queryClient.invalidateQueries({
              queryKey: getGetPublicImageTagListQueryKey(),
            });
          }
          setOpen(false);
          setShowOverwriteConfirm(false);
          setPendingFormData(null);
        },
      },
    );
  };

  const onSubmit = async (data: CreateRegistryTagFormType) => {
    if (isPending || isChecking) return;

    setIsChecking(true);
    try {
      const result = await checkImageTagExistsByMode(mode, {
        harborImageName: data.harborImageName,
        tagName: data.imageTagName,
        workspaceId: selectedWorkspace?.workspaceId,
      });

      if (result.exists) {
        if (mode === "public") {
          // Public: 덮어쓰기 불가 - 에러 표시
          setError("imageTagName", {
            type: "manual",
            message: "이미 등록된 태그입니다. 다른 태그명을 입력해 주세요.",
          });
        } else {
          // Private: 덮어쓰기 확인 모달 표시
          setPendingFormData(data);
          setShowOverwriteConfirm(true);
        }
      } else {
        // 존재하지 않으면 바로 생성
        executeCreate(data);
      }
    } catch {
      // API 에러 시 그냥 생성 시도 (백엔드에서 처리)
      executeCreate(data);
    } finally {
      setIsChecking(false);
    }
  };

  const handleOverwriteConfirm = () => {
    if (pendingFormData) {
      executeCreate(pendingFormData);
    }
  };

  const handleOverwriteCancel = () => {
    setShowOverwriteConfirm(false);
    setPendingFormData(null);
  };

  const handleCancel = () => {
    if (isPending || isChecking) return;
    setOpen(false);
  };

  // filter에서 전달받은 데이터 구독 및 모달 열기
  useSubscribe<string>(
    REGISTRY_EVENTS.openCreateTagModal,
    (harborImageName) => {
      reset({
        harborImageName,
        imageTagName: "",
        credentialId: undefined,
        description: "",
      });
      setOpen(true);
    },
  );

  const isLoading = isPending || isChecking;

  return (
    <>
      <Modal
        type="primary"
        icon={<Icon name="Plus" color="#fff" size={18} />}
        modalWidth={580}
        open={open}
        title="컨테이너 이미지 태그 추가"
        showCancelButton
        onCancel={handleCancel}
        okText="추가"
        onOk={handleSubmit(onSubmit)}
        centered
        showHeaderBorder
        closable={!isLoading}
        maskClosable={!isLoading}
        keyboard={!isLoading}
        okButtonProps={{
          loading: isLoading,
        }}
        cancelButtonProps={{
          disabled: isLoading,
        }}
      >
        <Form onFinish={handleSubmit(onSubmit)}>
          <FormRow>
            <Controller
              name="harborImageName"
              control={control}
              render={({ field }) => (
                <FormItem
                  label="컨테이너 이미지"
                  required
                  validateStatus={errors.harborImageName ? "error" : undefined}
                  htmlFor="harborImageName"
                  help={errors.harborImageName?.message}
                >
                  <Input
                    {...field}
                    type="text"
                    id="harborImageName"
                    placeholder="이미지 URL을 입력해 주세요."
                    autoComplete="off"
                    width="100%"
                  />
                </FormItem>
              )}
            />
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
          </FormRow>
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
              <LastFormItem
                label="설명"
                validateStatus={errors.description ? "error" : undefined}
                help={errors.description?.message}
              >
                <TextArea
                  {...field}
                  placeholder="태그에 대한 설명을 입력해 주세요."
                  width="100%"
                />
              </LastFormItem>
            )}
          />
        </Form>
      </Modal>

      {/* 동일 태그 존재 시 확인 모달 */}
      <Modal
        type="danger"
        modalWidth={400}
        open={showOverwriteConfirm}
        title="이미지 태그 추가"
        showCancelButton
        onCancel={handleOverwriteCancel}
        okText="확인"
        onOk={handleOverwriteConfirm}
        centered
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
        <p>
          이미 동일한 태그가 존재합니다.
          <br />
          추가할 경우, 기존 이미지 태그는 삭제됩니다.
        </p>
      </Modal>
    </>
  );
}
