"use client";

import { useSetAtom } from "jotai";
import { useRef } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Input, Modal } from "xiilab-ui";

import {
  openCreateOnPremiseVolumeModalAtom,
  openSelectVolumeModalAtom,
} from "@/atoms/volume/volume-list.atom";
import { FormLabel } from "@/components/common/form/form-label";
import { VOLUME_EVENTS } from "@/constants/common/pubsub.constant";
import { useClearForm } from "@/hooks/common/use-clear-form";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { useCreateVolume } from "@/hooks/volume/use-create-volume";
import { FormItem, FormRow } from "@/styles/layers/form-layer.styled";
import type { CreateVolumePayload } from "@/types/volume/volume.type";
import { StorageIcon } from "../common/icon/storage-icon";

export function CreateOnPremVolumeModal() {
  const formRef = useRef<HTMLFormElement>(null);

  // pubsub 이벤트 발행을 위한 훅
  const publish = usePublish();

  // 모달 상태 관리
  const setOpenSelectVolumeModal = useSetAtom(openSelectVolumeModalAtom);
  const { open, onClose } = useGlobalModal(openCreateOnPremiseVolumeModalAtom);

  // 볼륨 생성 Hook 사용
  const createVolume = useCreateVolume();

  // 폼 초기화 훅 사용
  const { clearForm, getFormKey } = useClearForm();

  /**
   * 모달 취소 핸들러
   *
   * 현재 모달을 닫고 스토리지 타입 선택 모달을 다시 열어줍니다.
   */
  const handleCancel = () => {
    onClose();
    setOpenSelectVolumeModal(true);
  };

  /**
   * 볼륨 생성 제출 핸들러
   *
   * 폼 데이터를 수집하여 볼륨 생성 API를 호출합니다.
   * 성공 시 성공 메시지를 표시하고 모달을 닫습니다.
   */
  const handleSubmit = () => {
    const payload = createPayload();

    if (payload) {
      createVolume.mutate(payload, {
        onSuccess: () => {
          toast.success("볼륨 생성 성공");
          onClose();
          handleClear();
          publish(VOLUME_EVENTS.clearSelectVolumeModal, payload);
        },
      });
    }
  };

  /**
   * 폼 데이터를 기반으로 페이로드 생성
   *
   * 폼에서 입력된 데이터를 수집하여 볼륨 생성 API에 필요한 페이로드를 생성합니다.
   *
   * @returns 생성된 페이로드 또는 null (폼이 없는 경우)
   */
  const createPayload = (): CreateVolumePayload | null => {
    if (!formRef.current) return null;

    // 폼 데이터 수집
    const formData = new FormData(formRef.current);

    return {
      volumeName: formData.get("onpremVolumeName") as string,
      mountPath: formData.get("onpremVolumeMountPath") as string,
      serverIp: formData.get("onpremVolumeServerIp") as string,
      serverPath: formData.get("onpremVolumeServerPath") as string,
      volumeType: "LOCAL",
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
      modalWidth={370}
      type="primary"
      icon={
        <IconWrapper>
          <StorageIcon />
        </IconWrapper>
      }
      open={open}
      // closable
      title="On-premise Storage"
      showCancelButton
      cancelText="이전"
      onCancel={handleCancel}
      okText="추가"
      onOk={handleSubmit}
      centered
      okButtonProps={{
        disabled: false,
      }}
    >
      <form ref={formRef} key={getFormKey()}>
        <FormRow>
          <FormItem>
            <FormLabel htmlFor="onpremVolumeName">볼륨 이름</FormLabel>
            <Input
              type="text"
              id="onpremVolumeName"
              name="onpremVolumeName"
              placeholder="볼륨 이름을 입력해 주세요."
              width="100%"
            />
          </FormItem>
        </FormRow>
        {/* Server IP 입력 필드 */}
        <FormItem>
          <FormLabel htmlFor="onpremVolumeServerIp">Server IP</FormLabel>
          <Input
            type="text"
            id="onpremVolumeServerIp"
            name="onpremVolumeServerIp"
            placeholder="Server IP를 입력해 주세요."
            width="100%"
          />
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="onpremVolumeServerPath">Server Path</FormLabel>
          <Input
            type="text"
            id="onpremVolumeServerPath"
            name="onpremVolumeServerPath"
            placeholder="Server Path를 입력해 주세요."
            width="100%"
          />
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="onpremVolumeMountPath">마운트 경로</FormLabel>
          <Input
            type="text"
            id="onpremVolumeMountPath"
            name="onpremVolumeMountPath"
            placeholder="/usr/local"
            width="100%"
          />
        </FormItem>
        {/* TODO: 라벨 필드 추가 */}
      </form>
    </Modal>
  );
}

const IconWrapper = styled.span`
  --icon-fill: #fff;

  & svg {
    width: 14px;
    height: 14px;
  }
`;
