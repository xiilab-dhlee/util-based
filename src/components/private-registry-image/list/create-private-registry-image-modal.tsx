"use client";

import { useRef, useState } from "react";
import styled from "styled-components";
import { Icon, Input, Modal, Tag } from "xiilab-ui";

import { openCreatePrivateRegistryImageModalAtom } from "@/atoms/private-registry-image.atom";
import { FormLabel } from "@/components/common/form/form-label";
import { useClearForm } from "@/hooks/common/use-clear-form";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { FormItem } from "@/styles/layers/form-layer.styled";
import { SelectSearchedWorkload } from "./select-searched-workload";

export function CreatePrivateRegistryImageModal() {
  const formRef = useRef<HTMLFormElement>(null);

  const { clearForm, getFormKey } = useClearForm();

  const { open, onClose } = useGlobalModal(
    openCreatePrivateRegistryImageModalAtom,
  );

  const [checkedWorkloads, setCheckedWorkloads] = useState<Set<string>>(
    new Set(),
  );

  const handleSubmit = () => {
    clearForm();
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
      onCancel={onClose}
      okText="생성"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: false,
      }}
    >
      <form ref={formRef} key={getFormKey()}>
        <FormItem>
          <FormLabel htmlFor="privateRegistryImageName" className="required">
            컨테이너 이미지 이름
          </FormLabel>
          <Input
            type="text"
            id="privateRegistryImageName"
            name="privateRegistryImageName"
            placeholder="컨테이너 이미지 이름을 입력해 주세요."
            width="100%"
          />
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="privateRegistryImageTag" className="required">
            태그
          </FormLabel>
          <RecentTag>
            <TagLabel>최근 생성 태그:</TagLabel>
            <Tag variant="gray" theme="light">
              v1.0
            </Tag>
          </RecentTag>
          <Input
            type="text"
            id="privateRegistryImageTag"
            name="privateRegistryImageTag"
            placeholder="태그를 입력해 주세요. (문자, 숫자, 하이픈(-), 밑줄(_)만 사용 가능)"
            width="100%"
          />
        </FormItem>
      </form>
      <div>
        <FormLabel className="required">워크로드 선택</FormLabel>
        <SelectSearchedWorkload
          checkedWorkloads={checkedWorkloads}
          setCheckedWorkloads={setCheckedWorkloads}
        />
      </div>
    </Modal>
  );
}

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
