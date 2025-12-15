"use client";

import { useCallback, useState } from "react";
import styled from "styled-components";
import { Icon, Modal } from "xiilab-ui";

import { openUpdateResourceAllocationModalAtom } from "@/domain/workspace/state/workspace.atom";
import { Slider } from "@/shared/components/slider";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import type { CoreResourceType } from "@/shared/types/core.interface";
import { getResourceInfo } from "@/shared/utils/resource.util";

/**
 * 리소스 할당에서 지원하는 리소스 타입
 * - GPU_MEMORY, DISK는 할당 대상이 아님
 */
type AllocationResourceType = Extract<
  CoreResourceType,
  "GPU" | "CPU" | "MEM" | "MIG" | "MPS"
>;

/**
 * 리소스 할당량 데이터 타입
 */
export interface ResourceAllocationData {
  /** GPU 현재 할당량 */
  gpuValue: number;
  /** GPU 최대 할당량 */
  gpuLimit: number;
  /** CPU 현재 할당량 */
  cpuValue: number;
  /** CPU 최대 할당량 */
  cpuLimit: number;
  /** MEM 현재 할당량 */
  memValue: number;
  /** MEM 최대 할당량 */
  memLimit: number;
  /** MIG 리소스 목록 */
  migResources: Array<{
    name: string;
    value: number;
    limit: number;
  }>;
}

/**
 * 리소스 할당량 수정 모달 컴포넌트
 *
 * 워크스페이스의 리소스 할당량을 수정할 수 있는 모달입니다.
 * GPU, CPU, MEM, MIG 리소스의 할당량을 프로그레스 바와 함께 표시합니다.
 * PubSub 패턴을 사용하여 데이터를 전달받습니다.
 */
export function UpdateResourceAllocationModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openUpdateResourceAllocationModalAtom,
  );

  // 리소스 할당량 데이터
  const [resourceData, setResourceData] = useState<ResourceAllocationData>({
    gpuValue: 0,
    gpuLimit: 0,
    cpuValue: 0,
    cpuLimit: 0,
    memValue: 0,
    memLimit: 0,
    migResources: [],
  });

  // 폼 입력 값 상태
  const [formValues, setFormValues] = useState<{
    gpu: number;
    cpu: number;
    mem: number;
    mig: Record<string, number>;
  }>({
    gpu: 0,
    cpu: 0,
    mem: 0,
    mig: {},
  });

  /**
   */
  const handleResourceAllocationUpdate = useCallback(
    (data: ResourceAllocationData) => {
      setResourceData(data);
      // 폼 초기값 설정
      setFormValues({
        gpu: data.gpuValue,
        cpu: data.cpuValue,
        mem: data.memValue,
        mig: data.migResources.reduce(
          (acc, mig) => {
            acc[mig.name] = mig.value;
            return acc;
          },
          {} as Record<string, number>,
        ),
      });
      onOpen();
    },
    [onOpen],
  );

  /**
   * 리소스 할당량 수정 모달 데이터 구독
   */
  useSubscribe(
    WORKSPACE_EVENTS.sendUpdateResourceAllocation,
    handleResourceAllocationUpdate,
  );

  /**
   * 폼 제출 처리 함수
   */
  const handleOk = () => {
    // TODO: 리소스 할당량 수정 API 호출
    console.log("리소스 할당량 수정:", formValues);
    onClose();
  };

  /**
   * 입력값 변경 핸들러
   */
  const handleInputChange = ({
    type,
    value,
    migName,
  }: {
    type: AllocationResourceType;
    value: number;
    migName?: string;
  }) => {
    if (type === "MIG") {
      if (!migName) {
        return;
      }

      setFormValues((prev) => ({
        ...prev,
        mig: { ...prev.mig, [migName]: value },
      }));

      return;
    }

    if (type === "GPU" || type === "CPU" || type === "MEM") {
      const key = type.toLowerCase() as "gpu" | "cpu" | "mem";

      setFormValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit02" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="리소스 할당량 수정"
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="리소스 수정"
      onOk={handleOk}
      centered
      showHeaderBorder
    >
      <ModalContent>
        {/* GPU 리소스 */}
        <ResourceSection>
          <ResourceLabel>{getResourceInfo("GPU").text}</ResourceLabel>
          <Slider
            value={formValues.gpu}
            min={0}
            max={resourceData.gpuLimit}
            type="GPU"
            width="100%"
            onChange={(value) =>
              handleInputChange({
                type: "GPU",
                value,
              })
            }
          />
        </ResourceSection>

        {/* MIG 리소스 */}
        {resourceData.migResources.map((mig) => (
          <ResourceSection key={mig.name}>
            <MigLabel>
              <span>{getResourceInfo("MIG").text}</span>
              <MigDivider />
              <span>{mig.name}</span>
            </MigLabel>
            <Slider
              value={formValues.mig[mig.name] ?? mig.value}
              min={0}
              max={mig.limit}
              type="MIG"
              width="100%"
              onChange={(value) =>
                handleInputChange({
                  type: "MIG",
                  value,
                  migName: mig.name,
                })
              }
            />
          </ResourceSection>
        ))}

        {/* CPU 리소스 */}
        <ResourceSection>
          <ResourceLabel>{getResourceInfo("CPU").text}</ResourceLabel>
          <Slider
            value={formValues.cpu}
            min={0}
            max={resourceData.cpuLimit}
            type="CPU"
            width="100%"
            onChange={(value) =>
              handleInputChange({
                type: "CPU",
                value,
              })
            }
          />
        </ResourceSection>

        {/* MEM 리소스 */}
        <ResourceSection>
          <ResourceLabel>{getResourceInfo("MEM").text}</ResourceLabel>
          <Slider
            value={formValues.mem}
            min={0}
            max={resourceData.memLimit}
            type="MEM"
            width="100%"
            onChange={(value) =>
              handleInputChange({
                type: "MEM",
                value,
              })
            }
          />
        </ResourceSection>
      </ModalContent>
    </Modal>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px 0;
`;

/** 리소스 섹션 (레이블 + 컨트롤) */
const ResourceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

`;

const ResourceLabel = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #000;
`;

const MigLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #000;
`;

const MigDivider = styled.div`
  width: 1px;
  height: 9px;
  background-color: #acacac;
`;
