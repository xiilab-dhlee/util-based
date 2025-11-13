"use client";

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Icon, Input, Modal } from "xiilab-ui";

import { openCreateCommitImageModalAtom } from "@/atoms/workload/workload-detail.atom";
import { FormItem } from "@/components/common/form/form-item";
import { FormLabel } from "@/components/common/form/form-label";
import pubsubConstants from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import { useCreateCommitImage } from "@/hooks/workload/use-create-commit-image";
import type { CreateCommitImagePayload } from "@/types/workload/workload.type";

/**
 * Commit Image 생성 모달 컴포넌트
 *
 * 워크로드의 현재 상태를 기반으로 Docker 이미지를 생성할 수 있는 모달입니다.
 * 이미지 이름과 태그를 입력받아 pubsub 이벤트를 발행합니다.
 * 다른 컴포넌트에서 이 이벤트를 구독하여 실제 이미지 생성 작업을 처리합니다.
 */
export function CreateCommitImageModal() {
  const formRef = useRef<HTMLFormElement>(null);

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openCreateCommitImageModalAtom,
  );

  // 워크로드 ID
  const [workloadId, setWorkloadId] = useState("");
  // 워크스페이스 ID
  const [workspaceId, setWorkspaceId] = useState("");
  // 워크로드 타입
  const [workloadType, setWorkloadType] = useState("");

  const createCommitImage = useCreateCommitImage();

  /**
   * 폼 제출 처리 함수
   *
   * Commit Image 생성 데이터를 pubsub 이벤트로 발행하고 모달을 닫습니다.
   * 다른 컴포넌트에서 이 이벤트를 구독하여 실제 이미지 생성 작업을 처리합니다.
   */
  const handleSubmit = () => {
    const payload = createPayload();

    if (payload) {
      createCommitImage.mutate(payload, {
        onSuccess: () => {
          toast.success("Commit Image 생성 성공");
          onClose();
        },
      });
    }
  };

  /**
   * 폼 데이터를 기반으로 페이로드 생성
   *
   * @returns 생성된 페이로드 또는 null (폼이 없는 경우)
   */
  const createPayload = (): CreateCommitImagePayload | null => {
    if (!formRef.current) return null;

    // 폼 데이터 수집
    const formData = new FormData(formRef.current);

    return {
      workloadId,
      workspaceId,
      workloadType,
      imageName: formData.get("commitImageName") as string,
      imageTag: formData.get("commitImageTag") as string,
    };
  };

  /**
   * Commit Image 생성 모달 데이터 구독
   */
  useSubscribe<CreateCommitImagePayload>(
    pubsubConstants.workload.sendCommitImage,
    (eventData) => {
      // 워크로드 정보 설정
      setWorkloadId(eventData.workloadId);
      setWorkspaceId(eventData.workspaceId);
      setWorkloadType(eventData.workloadType);

      // 모달 열기
      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="Commit Image 생성"
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
      <form ref={formRef}>
        {/* 이미지 이름 입력 필드 */}
        <FormItem>
          <FormLabel htmlFor="commitImageName">이름</FormLabel>
          <Input
            type="text"
            id="commitImageName"
            name="commitImageName"
            placeholder="이름을 입력해 주세요."
            width="100%"
          />
        </FormItem>
        {/* 이미지 태그 입력 필드 */}
        <FormItem>
          <FormLabel htmlFor="commitImageTag">태그</FormLabel>
          <Input
            type="text"
            id="commitImageTag"
            name="commitImageTag"
            placeholder="태그를 입력해 주세요. (문자, 숫자, 하이픈(-), 밑줄(_)만 사용 가능)"
            width="100%"
          />
        </FormItem>
      </form>
    </Modal>
  );
}

