"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Dropdown, Icon, Modal, TextArea } from "xiilab-ui";

import { openUpdateInternalRegistryImageModalAtom } from "@/domain/internal-registry-image/state/internal-registry-image.atom";
import type { UpdateInternalRegistryImagePayload } from "@/domain/internal-registry-image/types/internal-registry-image.type";
import { FormLabel } from "@/shared/components/form/form-label";
import { INTERNAL_REGISTRY_IMAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { useSelect } from "@/shared/hooks/use-select";
import { FormItem } from "@/styles/layers/form-layer.styled";
import { INTERNAL_REGISTRY_IMAGE_STATUS_OPTIONS } from "../../constants/internal-registry-image.constant";
import { useUpdateInternalRegistryImage } from "../../hooks/use-update-internal-registry-image";
import type {
  InternalRegistryImageIdType,
  InternalRegistryImageListType,
} from "../../schemas/internal-registry-image.schema";

export function UpdateInternalRegistryImageModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openUpdateInternalRegistryImageModalAtom,
  );

  const [id, setId] = useState<InternalRegistryImageIdType | null>(null);
  const status = useSelect(null, INTERNAL_REGISTRY_IMAGE_STATUS_OPTIONS);
  const [description, setDescription] = useState("");

  const updateInternalRegistryImage = useUpdateInternalRegistryImage();

  /**
   * 폼 제출 처리 함수
   *
   * 워크로드 수정 데이터를 pubsub 이벤트로 발행하고 모달을 닫습니다.
   * 다른 컴포넌트에서 이 이벤트를 구독하여 실제 API 호출 등을 처리합니다.
   */
  const handleSubmit = () => {
    const payload = createPayload();

    if (payload) {
      updateInternalRegistryImage.mutate(payload, {
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
  const createPayload = () => {
    const payload: UpdateInternalRegistryImagePayload = {};

    if (id) {
      payload.id = id;
    }

    return payload;
  };

  // 동기화 이벤트 구독
  useSubscribe(
    INTERNAL_REGISTRY_IMAGE_EVENTS.sendUpdateImage,
    (eventData: InternalRegistryImageListType) => {
      setId(eventData.id);
      status.setValue(eventData.status);
      setDescription(eventData.description || "");

      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit01" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="컨테이너 이미지 정보 수정"
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
        <FormItem>
          <FormLabel htmlFor="updateInternalRegistryImageStatus">
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
        <FormItem>
          <FormLabel htmlFor="updateInternalRegistryImageDescription">
            컨테이너 이미지 설명
          </FormLabel>
          <TextArea
            id="updateInternalRegistryImageDescription"
            placeholder="컨테이너 이미지에 대한 설명을 입력해 주세요."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormItem>
      </form>
    </Modal>
  );
}
