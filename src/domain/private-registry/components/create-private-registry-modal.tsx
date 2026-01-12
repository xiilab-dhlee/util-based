"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Form, FormItem, Icon, Input, Modal } from "xiilab-ui";

import {
  getGetPrivateRegistryListQueryKey,
  useCreateExternalImage1,
} from "@/api/generated/private-registry/private-registry";
import { SelectSearchedWorkload } from "@/domain/internal-registry-image/components/list/select-searched-workload";
import {
  type CreatePrivateRegistryFormType,
  createPrivateRegistrySchema,
} from "@/domain/private-registry/schemas/create-private-registry.schema";
import { openCreatePrivateRegistryModalAtom } from "@/domain/private-registry/state/private-registry.atom";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

/**
 * 프라이빗 레지스트리 이미지 생성 모달
 *
 * 유효성 검증 규칙:
 * - 컨테이너 이미지 이름: 필수
 * - 태그: 필수, 문자/숫자/하이픈(-)/밑줄(_)만 허용
 *
 * 워크로드 선택은 폼 외부에서 별도로 관리됩니다.
 */
export function CreatePrivateRegistryModal() {
  const { open, onClose } = useGlobalModal(openCreatePrivateRegistryModalAtom);
  const queryClient = useQueryClient();

  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  const [checkedWorkload, setCheckedWorkload] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreatePrivateRegistryFormType>({
    resolver: zodResolver(createPrivateRegistrySchema),
    mode: "onChange",
    defaultValues: {
      imageName: "",
      tag: "",
    },
  });

  const { mutate: createImage, isPending } = useCreateExternalImage1();

  const onSubmit = (data: CreatePrivateRegistryFormType) => {
    if (!selectedWorkspace) {
      toast.error("워크스페이스를 선택해 주세요.");
      return;
    }

    if (!checkedWorkload) {
      toast.error("워크로드를 선택해 주세요.");
      return;
    }

    if (isPending) {
      toast.error("요청 중입니다.");
      return;
    }

    createImage(
      {
        data: {
          imageName: data.imageName,
          imageTagName: data.tag,
          registryChannel: "DOCKER", // TODO: registryChannel 선택 UI 추가 필요 시 수정
          // workloadId: checkedWorkload,
          workspaceId: selectedWorkspace?.workspaceId ?? -1,
        },
      },
      {
        onSuccess: () => {
          toast.success("개인 레지스트리 이미지가 생성되었습니다.");
          queryClient.invalidateQueries({
            queryKey: getGetPrivateRegistryListQueryKey(),
          });
          handleClose();
        },
        onError: () => {
          toast.error("개인 레지스트리 이미지 생성에 실패했습니다.");
        },
      },
    );
  };

  const handleClose = () => {
    reset();
    setCheckedWorkload(null);
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
      title="컨테이너 이미지 생성"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="생성"
      onOk={handleSubmit(onSubmit)}
      afterClose={handleClose}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: !isValid || !checkedWorkload || isPending,
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <StyledForm onFinish={handleSubmit(onSubmit)}>
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
        <Controller
          name="tag"
          control={control}
          render={({ field }) => (
            <FormItem
              label="태그"
              required
              validateStatus={errors.tag ? "error" : undefined}
              htmlFor="privateRegistryImageTag"
              help={errors.tag?.message}
            >
              <Input
                {...field}
                type="text"
                id="privateRegistryImageTag"
                placeholder="태그를 입력해 주세요. (문자, 숫자, 하이픈(-), 밑줄(_)만 사용 가능)"
                autoComplete="off"
                width="100%"
              />
            </FormItem>
          )}
        />
        <FormItem label="워크로드 선택" required htmlFor="workloadSelect">
          <SelectSearchedWorkload
            checkedWorkload={checkedWorkload}
            setCheckedWorkload={setCheckedWorkload}
          />
        </FormItem>
      </StyledForm>
    </Modal>
  );
}

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
