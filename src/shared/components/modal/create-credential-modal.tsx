"use client";

import { useRef } from "react";
import { Dropdown, Icon, Input, Modal, TextArea } from "xiilab-ui";

import { CREDENTIAL_TYPE_OPTIONS } from "@/domain/credential/constants/credential.constant";
import { useCreateCredential } from "@/domain/credential/hooks/use-create-credential";
import type {
  CreateCredentialPayload,
  CredentialType,
} from "@/domain/credential/types/credential.type";
import { FormLabel } from "@/shared/components/form/form-label";
import { openCreateCredentialModalAtom } from "@/shared/hooks/modal.atom";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSelect } from "@/shared/hooks/use-select";
import { FormItem, FormRow } from "@/styles/layers/form-layer.styled";

/**
 * 크레덴셜 생성 모달 컴포넌트
 *
 * 새로운 크레덴셜을 생성할 수 있는 모달입니다.
 */
export function CreateCredentialModal() {
  const formRef = useRef<HTMLFormElement>(null);

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onClose } = useGlobalModal(openCreateCredentialModalAtom);

  // 크레덴셜 타입 선택을 위한 useSelect 훅
  const typeSelect = useSelect<CredentialType>(
    "GIT",
    CREDENTIAL_TYPE_OPTIONS,
    true,
  );

  const createCredential = useCreateCredential();

  const handleSubmit = () => {
    const payload = createPayload();

    // TODO: payload 검증 및 유효성 검사 추가 필요
    if (payload) {
      // TODO: validation 추가 필요
      createCredential.mutate(payload);
    }
  };

  const createPayload = (): CreateCredentialPayload | null => {
    if (!formRef.current) return null;
    // 폼 데이터 수집
    const formData = new FormData(formRef.current);

    return {
      type: typeSelect.value as CredentialType,
      name: formData.get("credentialName") as string,
      description: formData.get("credentialDescription") as string,
      privateRegistryUrl: formData.get(
        "credentialPrivateRegistryUrl",
      ) as string,
      id: formData.get("credentialId") as string,
      pw: formData.get("credentialToken") as string,
    };
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="크레덴셜 추가"
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="추가"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: false,
      }}
    >
      <form ref={formRef}>
        <FormRow>
          <FormItem>
            <FormLabel>타입</FormLabel>
            <Dropdown
              options={typeSelect.options}
              onChange={typeSelect.onChange}
              value={typeSelect.value}
              width="100%"
              placeholder="타입을 선택해 주세요."
            />
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="credentialName">이름</FormLabel>
            <Input
              type="text"
              id="credentialName"
              name="credentialName"
              placeholder="이름을 입력해 주세요."
              width="100%"
            />
          </FormItem>
        </FormRow>
        {/* 설명 입력 필드 */}
        <FormItem>
          <FormLabel htmlFor="credentialDescription">설명</FormLabel>
          <TextArea
            id="credentialDescription"
            name="credentialDescription"
            placeholder="설명을 입력해 주세요."
          />
        </FormItem>
        {typeSelect.value === "DOCKER" && (
          <FormItem>
            <FormLabel htmlFor="credentialPrivateRegistryUrl">
              내부 레지스트리 URL
            </FormLabel>
            <Input
              type="text"
              id="credentialPrivateRegistryUrl"
              name="credentialPrivateRegistryUrl"
              placeholder="https://index.docker.io/v1/"
            />
          </FormItem>
        )}

        <FormItem>
          <FormLabel htmlFor="credentialId">아이디</FormLabel>
          <Input
            type="text"
            id="credentialId"
            name="credentialId"
            placeholder="아이디를 입력해 주세요."
            width="100%"
          />
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="credentialToken">토큰</FormLabel>
          <Input
            type="text"
            id="credentialToken"
            name="credentialToken"
            placeholder="토큰을 입력해 주세요."
            width="100%"
          />
        </FormItem>
      </form>
    </Modal>
  );
}
