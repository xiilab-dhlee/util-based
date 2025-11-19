"use client";

import { useState, useCallback } from "react";
import { Modal, Icon, TextArea } from "xiilab-ui";
import styled from "styled-components";
import { useAtomValue, useSetAtom } from "jotai";
import Slider from "@/components/common/slider/custom-slider";
import {
  resourceSettingModalOpenAtom,
  closeResourceSettingModalAtom,
} from "@/atoms/setting/setting-modal.atom";

interface ResourceRequestForm {
  gpu: number;
  cpu: number;
  memory: number;
  reason: string;
}

/**
 * 리소스 요청 모달 컴포넌트
 *
 * 워크스페이스의 리소스 요청을 관리할 수 있는 모달입니다.
 */
function ResourceSettingModal() {
  const isVisible = useAtomValue(resourceSettingModalOpenAtom);
  const closeModal = useSetAtom(closeResourceSettingModalAtom);

  // 폼 상태 관리
  const [form, setForm] = useState<ResourceRequestForm>({
    gpu: 2,
    cpu: 123,
    memory: 82,
    reason: "",
  });

  /**
   * 폼 값 변경 핸들러
   */
  const handleValueChange = useCallback(
    (field: keyof Omit<ResourceRequestForm, "reason">) => (value: number) => {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  /**
   * 요청 사유 변경 핸들러
   */
  const handleReasonChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        reason: event.target.value,
      }));
    },
    []
  );

  /**
   * 취소 버튼 클릭 핸들러
   */
  const handleCancel = useCallback(() => {
    // 폼 초기화
    setForm({
      gpu: 2,
      cpu: 123,
      memory: 82,
      reason: "",
    });
    closeModal();
  }, [closeModal]);

  /**
   * 리소스 요청 버튼 클릭 핸들러
   */
  const handleSubmit = useCallback(() => {
    // TODO: 실제 API 호출로 대체 필요
    console.log("리소스 요청:", form);

    // 성공 후 모달 닫기
    closeModal();
  }, [form, closeModal]);

  /**
   * 모달 열림/닫힘 시 폼 초기화
   */
  const handleAfterOpenChange = useCallback((open: boolean) => {
    if (open) {
      setForm({
        gpu: 2,
        cpu: 123,
        memory: 82,
        reason: "",
      });
    }
  }, []);

  return (
    <Modal
      title="리소스 요청"
      open={isVisible}
      onCancel={handleCancel}
      modalWidth={370}
      centered
      showHeaderBorder
      icon={<Icon name="Request" size={20} color="#FFF" />}
      type="primary"
      okText="리소스 요청"
      cancelText="취소"
      onOk={handleSubmit}
      afterOpenChange={handleAfterOpenChange}
    >
      <ModalContent>
        {/* GPU 슬라이더 */}
        <ResourceRow>
          <ResourceLabel>GPU</ResourceLabel>
          <SliderContainer>
            <Slider
              type="gpu"
              value={form.gpu}
              onChange={handleValueChange("gpu")}
              min={0}
              max={10}
              step={1}
              width={280}
              aria-label="GPU 개수 설정"
            />
          </SliderContainer>
        </ResourceRow>

        {/* CPU 슬라이더 */}
        <ResourceRow>
          <ResourceLabel>CPU</ResourceLabel>
          <SliderContainer>
            <Slider
              type="cpu"
              value={form.cpu}
              onChange={handleValueChange("cpu")}
              min={0}
              max={500}
              step={1}
              width={280}
              aria-label="CPU 코어 수 설정"
            />
          </SliderContainer>
        </ResourceRow>

        {/* Memory 슬라이더 */}
        <ResourceRow>
          <ResourceLabel>MEM</ResourceLabel>
          <SliderContainer>
            <Slider
              type="memory"
              value={form.memory}
              onChange={handleValueChange("memory")}
              min={0}
              max={200}
              step={1}
              width={280}
              aria-label="메모리 용량 설정"
            />
          </SliderContainer>
        </ResourceRow>

        {/* 요청 사유 */}
        <ReasonSection>
          <ReasonLabel>요청 사유</ReasonLabel>
          <TextArea
            value={form.reason}
            onChange={handleReasonChange}
            placeholder="리소스 요청 사유를 입력해 주세요"
            rows={4}
            maxLength={500}
            style={{
              width: "100%",
              resize: "none",
            }}
          />
        </ReasonSection>
      </ModalContent>
    </Modal>
  );
}

const ModalContent = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ResourceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ResourceLabel = styled.div`
  width: 34px;

  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  color: #000;
  text-align: left;
`;

const SliderContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const ReasonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const ReasonLabel = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  color: #000;
`;

export default ResourceSettingModal;
