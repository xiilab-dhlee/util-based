"use client";

import { useRef, useState } from "react";
import styled from "styled-components";
import { Dropdown, Icon, Input, Modal, Tag, TextArea } from "xiilab-ui";

import { openCreatePrivateRegistryImageModalAtom } from "@/domain/private-registry-image/state/private-registry-image.atom";
import { FormLabel } from "@/shared/components/form/form-label";
import { useClearForm } from "@/shared/hooks/use-clear-form";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSelect } from "@/shared/hooks/use-select";
import { FormItem, FormRow } from "@/styles/layers/form-layer.styled";
import { PRIVATE_REGISTRY_IMAGE_STATUS_OPTIONS } from "../../constants/private-registry-image.constant";
import { SelectSearchedWorkload } from "../select-searched-workload";

export function CreatePrivateRegistryImageModal() {
  const formRef = useRef<HTMLFormElement>(null);

  const { clearForm, getFormKey } = useClearForm();

  const { open, onClose } = useGlobalModal(
    openCreatePrivateRegistryImageModalAtom,
  );

  const [checkedWorkload, setCheckedWorkload] = useState<string | null>(null);

  const status = useSelect(null, PRIVATE_REGISTRY_IMAGE_STATUS_OPTIONS);

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
      okText="등록"
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
        <FormRow>
          <FormItem>
            <FormLabel
              htmlFor="privateRegistryImageTag"
              className="required"
              rightChildren={
                <RecentTag>
                  <TagLabel>최근 생성 태그:</TagLabel>
                  <Tag variant="gray" theme="light" style={{ height: 16 }}>
                    v1.0
                  </Tag>
                </RecentTag>
              }
            >
              태그
            </FormLabel>

            <Input
              type="text"
              id="privateRegistryImageTag"
              name="privateRegistryImageTag"
              placeholder="태그를 입력해 주세요. (문자, 숫자, 하이픈(-), 밑줄(_)만 사용 가능)"
              width="100%"
            />
          </FormItem>{" "}
          <FormItem>
            <FormLabel
              htmlFor="privateRegistryImageStatus"
              className="required"
            >
              공개 설정
            </FormLabel>
            <Dropdown
              options={status.options}
              onChange={status.onChange}
              value={status.value}
              placeholder="선택"
              theme="light"
              width="100%"
            />
          </FormItem>
        </FormRow>
        <FormItem>
          <FormLabel htmlFor="privateRegistryImageDescription">설명</FormLabel>
          <TextArea
            placeholder="컨테이너 이미지에 대한 설명을 입력해 주세요."
            width="100%"
          />
        </FormItem>
      </form>
      <div>
        <FormLabel className="required">워크로드 선택</FormLabel>
        <SelectSearchedWorkload
          checkedWorkload={checkedWorkload}
          setCheckedWorkload={setCheckedWorkload}
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
