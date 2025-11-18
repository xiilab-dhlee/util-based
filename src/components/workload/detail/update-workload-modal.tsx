"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Input, Modal, TextArea } from "xiilab-ui";

import { openUpdateWorkloadModalAtom } from "@/atoms/workload.atom";
import { FormLabel } from "@/components/common/form/form-label";
import { MyIcon } from "@/components/common/icon";
import { WORKLOAD_EVENTS } from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import { useUpdateWorkload } from "@/hooks/workload/use-update-workload";
import type { WorkloadDetailType } from "@/schemas/workload.schema";
import { FormItem } from "@/styles/layers/form-layer.styled";
import type { UpdateWorkloadPayload } from "@/types/workload/workload.type";

/**
 * 워크로드 수정 모달 컴포넌트
 *
 * 워크로드의 이름과 설명을 수정할 수 있는 모달입니다.
 * 워크로드 상세 페이지에서 사용되는 모달입니다.
 * 워크로드 상세 페이지에서 데이터 동기화 이벤트를 구독하여 데이터를 업데이트합니다.
 * 수정 완료 시 pubsub 이벤트를 발행하여 다른 컴포넌트에서 처리할 수 있습니다
 */
export function UpdateWorkloadModal() {
  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(openUpdateWorkloadModalAtom);

  // 워크로드 ID
  const [workloadId, setWorkloadId] = useState("");
  // 워크스페이스 ID
  const [workspaceId, setWorkspaceId] = useState("");
  // 워크로드 이름
  const [workloadName, setWorkloadName] = useState("");
  // 워크로드 설명
  const [description, setDescription] = useState("");

  const updateWorkload = useUpdateWorkload();

  /**
   * 폼 제출 처리 함수
   *
   * 워크로드 수정 데이터를 pubsub 이벤트로 발행하고 모달을 닫습니다.
   * 다른 컴포넌트에서 이 이벤트를 구독하여 실제 API 호출 등을 처리합니다.
   */
  const handleSubmit = () => {
    const payload = createPayload();

    if (payload) {
      updateWorkload.mutate(payload, {
        onSuccess: () => {
          toast.success("워크로드 수정 성공");
          onClose();
        },
      });
    }
  };

  /**
   * 페이로드 생성
   */
  const createPayload = (): UpdateWorkloadPayload => {
    // TODO: 추후 라벨 추가
    return {
      workloadId,
      workspaceId,
      workloadName,
      description,
    };
  };

  // 동기화 이벤트 구독
  useSubscribe<WorkloadDetailType>(
    WORKLOAD_EVENTS.sendUpdateWorkload,
    (eventData) => {
      const { id, workspaceId, workloadName, description } = eventData;

      setWorkloadId(id);
      setWorkspaceId(workspaceId);
      setWorkloadName(workloadName);
      setDescription(description || "");

      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<MyIcon name="Edit01" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="워크로드 정보 수정"
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="수정 완료"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: false,
      }}
    >
      <form>
        {/* 워크로드 이름 입력 필드 */}
        <FormItem>
          <FormLabel htmlFor="updateWorkloadName">이름</FormLabel>
          <Input
            type="text"
            id="updateWorkloadName"
            placeholder="이름을 입력해 주세요."
            value={workloadName}
            onChange={(e) => setWorkloadName(e.target.value)}
            width="100%"
          />
        </FormItem>

        {/* 워크로드 설명 입력 필드 */}
        <FormItem>
          <FormLabel htmlFor="updateWorkloadDescription">설명</FormLabel>
          <TextArea
            id="updateWorkloadDescription"
            placeholder="설명을 입력해 주세요."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormItem>
        {/* TODO: 추후 라벨 기능 개발 시 추가 */}
      </form>
    </Modal>
  );
}
