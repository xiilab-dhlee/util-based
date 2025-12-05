"use client";

import { type ChangeEvent, useState } from "react";
import styled from "styled-components";
import { Icon, Modal, TextArea } from "xiilab-ui";

import { openCreateResourceRequestModalAtom } from "@/domain/setting/state/setting.atom";
import { Slider } from "@/shared/components/slider";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

export function CreateResourceSettingModal() {
  const { open, onClose } = useGlobalModal(openCreateResourceRequestModalAtom);

  const [gpu, setGpu] = useState<number>(0);
  const [cpu, setCpu] = useState<number>(0);
  const [memory, setMemory] = useState<number>(0);
  const [reason, setReason] = useState<string>("");

  const handleReasonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setReason(event.target.value);
  };

  const handleSubmit = () => {};

  return (
    <Modal
      title="리소스 요청"
      open={open}
      onCancel={onClose}
      modalWidth={370}
      centered
      showHeaderBorder
      icon={<Icon name="Request" size={20} color="#FFF" />}
      type="primary"
      okText="리소스 요청"
      cancelText="취소"
      onOk={handleSubmit}
    >
      <ModalContent>
        {/* GPU 슬라이더 */}
        <ResourceRow>
          <ResourceLabel>GPU</ResourceLabel>
          <SliderContainer>
            <Slider
              min={0}
              max={200}
              value={gpu}
              onChange={(value) => setGpu(value)}
              type="GPU"
              width="100%"
            />
          </SliderContainer>
        </ResourceRow>

        {/* CPU 슬라이더 */}
        <ResourceRow>
          <ResourceLabel>CPU</ResourceLabel>
          <SliderContainer>
            <Slider
              min={0}
              max={200}
              value={cpu}
              onChange={(value) => setCpu(value)}
              type="CPU"
              width="100%"
            />
          </SliderContainer>
        </ResourceRow>

        {/* Memory 슬라이더 */}
        <ResourceRow>
          <ResourceLabel>MEM</ResourceLabel>
          <SliderContainer>
            <Slider
              min={0}
              max={200}
              value={memory}
              onChange={(value) => setMemory(value)}
              type="MEM"
              width="100%"
            />
          </SliderContainer>
        </ResourceRow>

        {/* 요청 사유 */}
        <ReasonSection>
          <ReasonLabel>요청 사유</ReasonLabel>
          <TextArea
            value={reason}
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
