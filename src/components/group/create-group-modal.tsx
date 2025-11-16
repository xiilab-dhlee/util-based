"use client";

import { useSetAtom } from "jotai";
import { useRef } from "react";
import { Input, Modal, TextArea } from "xiilab-ui";

import { openCreateGroupModalAtom } from "@/atoms/group/group.atom";
import { memberAddModalOpenAtom } from "@/atoms/setting/setting-modal.atom";
import { CreateModelButton } from "@/components/common/button/create-model-button";
import { FormLabel } from "@/components/common/form/form-label";
import { MyIcon } from "@/components/common/icon";
import { MyMultipleSelect } from "@/components/common/select/multiple";
import { useClearForm } from "@/hooks/common/use-clear-form";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { FormItem } from "@/styles/layers/form-layer.styled";
import type { CreateGroupPayload } from "@/types/group/group.type";

export function CreateGroupModal() {
  const formRef = useRef<HTMLFormElement>(null);

  // 모달 상태 관리
  const { open, onClose } = useGlobalModal(openCreateGroupModalAtom);
  const setMemberAddModalOpen = useSetAtom(memberAddModalOpenAtom);

  // 생성 Hook 사용
  // const createVolume = useCreateVolume();

  // 폼 초기화 훅 사용
  const { clearForm, getFormKey } = useClearForm();

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = () => {
    const payload = createPayload();

    if (payload) {
      handleClear();
      onClose();
      // createVolume.mutate(payload, {
      //   onSuccess: () => {
      //     toast.success("볼륨 생성 성공");
      //     onClose();
      //     handleClear();
      //     publish(VOLUME_EVENTS.clearSelectVolumeModal, payload);
      //   },
      // });
    }
  };

  const handleAddMember = () => {
    setMemberAddModalOpen(true);
  };

  const createPayload = (): CreateGroupPayload | null => {
    if (!formRef.current) return null;

    // 폼 데이터 수집
    // const formData = new FormData(formRef.current);

    return {
      // volumeName: formData.get("onpremVolumeName") as string,
    };
  };

  /**
   * 폼 입력값 초기화
   *
   * 폼의 모든 입력 필드를 초기 상태로 리셋합니다.
   */
  const handleClear = () => {
    // 폼 초기화 (강제 리렌더링)
    clearForm();
  };

  return (
    <Modal
      type="primary"
      icon={<MyIcon name="Plus" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="그룹 추가"
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="추가"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: false,
      }}
    >
      <form ref={formRef} key={getFormKey()}>
        <FormItem>
          <FormLabel htmlFor="groupName">이름</FormLabel>
          <Input
            type="text"
            id="groupName"
            name="groupName"
            placeholder="그룹 이름을 입력해 주세요."
            width="100%"
          />
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="groupDescription">설명</FormLabel>
          <TextArea
            id="groupDescription"
            name="groupDescription"
            placeholder="그룹 설명을 입력해 주세요."
          />
        </FormItem>
        <FormItem>
          <FormLabel
            htmlFor="groupDescription"
            rightChildren={
              <CreateModelButton onClick={handleAddMember} title="멤버 추가" />
            }
          >
            멤버
          </FormLabel>
          <MyMultipleSelect
            options={[
              { value: "홍길동", label: "홍길동" },
              { value: "김철수", label: "김철수" },
            ]}
            defaultValue={["홍길동", "김철수"]}
          />
        </FormItem>
      </form>
    </Modal>
  );
}
