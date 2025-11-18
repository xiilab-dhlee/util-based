"use client";

import { useSetAtom } from "jotai";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Input, Modal, Upload } from "xiilab-ui";

import {
  openCreateAstragoVolumeModalAtom,
  openSelectVolumeModalAtom,
} from "@/atoms/volume.atom";
import { FormLabel } from "@/components/common/form/form-label";
import { VOLUME_EVENTS } from "@/constants/common/pubsub.constant";
import { useClearForm } from "@/hooks/common/use-clear-form";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { useSelect } from "@/hooks/common/use-select";
import { useUploadFile } from "@/hooks/common/use-upload-file";
import { useCreateVolume } from "@/hooks/volume/use-create-volume";
import { FormItem, FormRow } from "@/styles/layers/form-layer.styled";
import type { CreateVolumePayload } from "@/types/volume/volume.type";
import { formatFileSize } from "@/utils/common/file.util";
import { MyIcon } from "../common/icon";
import { MySelect } from "../common/select";

/**
 * AstraGo 볼륨 생성 모달 컴포넌트
 *
 * 사용자가 AstraGo Storage를 사용하여 새로운 볼륨을 생성할 수 있는 모달입니다.
 * 스토리지 선택, 볼륨 이름 입력, 마운트 경로 설정, 파일 업로드 기능을 제공합니다.
 * 볼륨 생성 성공 시 pubsub을 통해 다른 컴포넌트에 알림을 전달합니다.
 *
 * @returns AstraGo 볼륨 생성 모달 JSX 요소
 */
export function CreateAstragoVolumeModal() {
  // 폼 참조 (폼 데이터 수집용)
  const formRef = useRef<HTMLFormElement>(null);

  // pubsub 이벤트 발행을 위한 훅
  const publish = usePublish();

  // 모달 상태 관리
  const setOpenSelectVolumeModal = useSetAtom(openSelectVolumeModalAtom);
  const { open, onClose } = useGlobalModal(openCreateAstragoVolumeModalAtom);

  // 볼륨 생성 Hook 사용
  const createVolume = useCreateVolume();

  // 스토리지 선택 상태 관리
  const [storageId, setStorageId] = useState<string | null>(null);
  // 폼 초기화 훅 사용
  const { clearForm, getFormKey } = useClearForm();

  const storage = useSelect(null, []);

  // 파일 업로드 Hook 사용 (최대 5MB, 초기 파일 포함)
  const { files, handleUpload, handleFileRemove, totalSize, clearFiles } =
    useUploadFile({
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

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
      volumeName: formData.get("astragoVolumeName") as string,
      mountPath: formData.get("astragoVolumeMountPath") as string,
      storageId,
      files,
      volumeType: "ASTRAGO",
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

    // 스토리지 선택 초기화
    setStorageId(null);

    // 파일 초기화
    clearFiles();
  };

  return (
    <Modal
      modalWidth={370}
      type="primary"
      icon={<MyIcon name="astrago" color="#fff" width={16} height={16} />}
      open={open}
      closable
      title="AstraGo Storage"
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
      {/* 볼륨 생성 폼 */}
      <form ref={formRef} key={getFormKey()}>
        {/* 스토리지 선택 및 볼륨 이름 입력 행 */}
        <FormRow>
          <FormItem>
            <FormLabel>스토리지 목록</FormLabel>
            <MySelect
              {...storage}
              width="100%"
              placeholder="스토리지를 선택해 주세요."
            />
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="astragoVolumeName">볼륨 이름</FormLabel>
            <Input
              type="text"
              id="astragoVolumeName"
              name="astragoVolumeName"
              placeholder="볼륨 이름을 입력해 주세요."
              width="100%"
            />
          </FormItem>
        </FormRow>

        {/* 마운트 경로 입력 필드 */}
        <FormItem>
          <FormLabel htmlFor="astragoVolumeMountPath">마운트 경로</FormLabel>
          <Input
            type="text"
            id="astragoVolumeMountPath"
            name="astragoVolumeMountPath"
            placeholder="/usr/local"
            width="100%"
          />
        </FormItem>

        {/* 파일 업로드 섹션 */}
        <FormItem>
          <FormLabel
            rightChildren={
              <FileTotalSize>
                ({formatFileSize(totalSize).formatted})
              </FileTotalSize>
            }
          >
            파일 업로드
          </FormLabel>
          <Upload
            files={files}
            layout="vertical"
            multiple
            onFileRemove={handleFileRemove}
            onUpload={handleUpload}
            width="100%"
          />
        </FormItem>
      </form>
    </Modal>
  );
}

/**
 * 파일 총 크기 표시 스타일
 *
 * 파일 업로드 섹션에서 총 파일 크기를 표시하는 텍스트 스타일입니다.
 */
const FileTotalSize = styled.span`
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  color: #828588;
`;
