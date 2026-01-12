"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Form, FormItem, Icon, Input, Modal, Tag } from "xiilab-ui";

import { SelectSearchedWorkload } from "@/domain/internal-registry-image/components/list/select-searched-workload";
import {
  type CreatePrivateRegistryFormType,
  createPrivateRegistrySchema,
} from "@/domain/private-registry/schemas/create-private-registry.schema";
import { openCreatePrivateRegistryModalAtom } from "@/domain/private-registry/state/private-registry.atom";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

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

  const onSubmit = (data: CreatePrivateRegistryFormType) => {
    console.log("Form data:", data);
    console.log("Selected workload:", checkedWorkload);
    // TODO: API 호출
    handleClose();
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
      closable
      title="컨테이너 이미지 생성"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="생성"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: !isValid,
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
              rightChildren={
                <RecentTag>
                  <TagLabel>최근 생성 태그:</TagLabel>
                  <Tag variant="gray" theme="light" style={{ height: 16 }}>
                    v1.0
                  </Tag>
                </RecentTag>
              }
            >
              <Input
                {...field}
                type="text"
                id="privateRegistryImageTag"
                placeholder="태그를 입력해 주세요. (문자, 숫자, 하이픈(-), 밑줄(_)만 사용 가능)"
                width="100%"
              />
            </FormItem>
          )}
        />
      </StyledForm>
      <WorkloadSection>
        <WorkloadLabel className="required">워크로드 선택</WorkloadLabel>
        <SelectSearchedWorkload
          checkedWorkload={checkedWorkload}
          setCheckedWorkload={setCheckedWorkload}
        />
      </WorkloadSection>
    </Modal>
  );
}

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RecentTag = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
`;

const TagLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #9ca0ab;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const WorkloadSection = styled.div`
  margin-top: 16px;
`;

const WorkloadLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;

  &.required::after {
    content: " *";
    color: #ff4d4f;
  }
`;
