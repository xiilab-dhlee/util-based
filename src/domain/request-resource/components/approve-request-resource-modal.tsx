"use client";

import { useRef } from "react";
import { Icon, Modal } from "xiilab-ui";

import { useApproveResourceForm } from "@/domain/request-resource/hooks/use-approve-resource-form";
import type { RequestResourceListType } from "@/domain/request-resource/schemas/request-resource.schema";
import { openApproveResourceModalAtom } from "@/domain/request-resource/state/request-resource.atom";
import {
  createSliderMarks,
  Slider,
  SliderLegend,
} from "@/shared/components/slider";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { getResourceInfo } from "@/shared/utils/resource.util";
import {
  UpdateResourceModalContainer,
  UpdateResourceModalIconDescription,
  UpdateResourceModalIconWrapper,
  UpdateResourceModalLegendWrapper,
  UpdateResourceModalResource,
  UpdateResourceModalResourceHeader,
  UpdateResourceModalResourceTitle,
  UpdateResourceModalResourceWrapper,
  UpdateResourceModalWorkspace,
  UpdateResourceModalWorkspaceLeft,
  UpdateResourceModalWorkspaceName,
  UpdateResourceModalWorkspaceRight,
} from "@/styles/layers/update-resource-modal-layers.styled";

/**
 * 데이터 기반으로 요청된 리소스 목록을 생성
 * req 값이 존재하는 리소스만 반환
 */
function getRequestedResources(data: RequestResourceListType | null) {
  if (!data) return [];

  return [
    {
      type: "GPU" as const,
      req: data.gpuReq,
      current: data.gpuCurrent,
      max: data.gpuMax,
    },
    {
      type: "CPU" as const,
      req: data.cpuReq,
      current: data.cpuCurrent,
      max: data.cpuMax,
    },
    {
      type: "MEM" as const,
      req: data.memReq,
      current: data.memCurrent,
      max: data.memMax,
    },
    // 추후 MPS, MIG 추가: { type: "MPS" as const, req: data.mpsReq, current: data.mpsCurrent, max: data.mpsMax },
  ].filter((entry) => entry.req != null);
}

export function ApproveResourceModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openApproveResourceModalAtom,
  );

  // 읽기 전용 데이터는 ref로 관리
  const resourceDataRef = useRef<RequestResourceListType | null>(null);

  // 폼 상태는 훅으로 관리
  const { formState, errors, setApproveValue, initialize, validate, reset } =
    useApproveResourceForm();

  // 이벤트 구독
  useSubscribe<RequestResourceListType>(
    WORKSPACE_EVENTS.sendApproveResource,
    (eventData) => {
      resourceDataRef.current = eventData;
      initialize(eventData.gpuReq, eventData.cpuReq, eventData.memReq);
      onOpen();
    },
  );

  // 모달 닫기 시 리셋
  const handleClose = () => {
    reset();
    resourceDataRef.current = null;
    onClose();
  };

  // 제출 시 검증
  const handleSubmit = () => {
    const data = resourceDataRef.current;
    if (!data) return;

    const payload = validate(data.gpuMax, data.cpuMax, data.memMax);
    if (!payload) return;

    // TODO: API 호출
    console.log("승인 payload:", payload);
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit02" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="리소스 승인"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="리소스 승인"
      onOk={handleSubmit}
      centered
      showHeaderBorder
    >
      <UpdateResourceModalContainer>
        <UpdateResourceModalWorkspace>
          <UpdateResourceModalWorkspaceLeft>
            <UpdateResourceModalIconWrapper>
              <Icon name="Workspace01" color="var(--icon-fill)" size={16} />
            </UpdateResourceModalIconWrapper>
            <UpdateResourceModalIconDescription>
              워크스페이스
            </UpdateResourceModalIconDescription>
          </UpdateResourceModalWorkspaceLeft>
          <UpdateResourceModalWorkspaceRight>
            <UpdateResourceModalWorkspaceName>
              {resourceDataRef.current?.workspaceName ?? ""}
            </UpdateResourceModalWorkspaceName>
          </UpdateResourceModalWorkspaceRight>
        </UpdateResourceModalWorkspace>
        <UpdateResourceModalResourceWrapper>
          <UpdateResourceModalLegendWrapper>
            <SliderLegend />
          </UpdateResourceModalLegendWrapper>
          {getRequestedResources(resourceDataRef.current).map((resource) => {
            const key = resource.type.toLowerCase() as "gpu" | "cpu" | "mem";

            return (
              <UpdateResourceModalResource key={resource.type}>
                <UpdateResourceModalResourceHeader>
                  <UpdateResourceModalResourceTitle>
                    {getResourceInfo(resource.type).text}
                  </UpdateResourceModalResourceTitle>
                </UpdateResourceModalResourceHeader>
                <Slider
                  width="100%"
                  min={0}
                  max={resource.max}
                  value={formState[`${key}Approve`]}
                  onChange={(v) => setApproveValue(resource.type, v)}
                  type={resource.type}
                  marks={createSliderMarks(resource.current, resource.req)}
                  showInput
                  error={!!errors[`${key}Approve`]}
                />
              </UpdateResourceModalResource>
            );
          })}
        </UpdateResourceModalResourceWrapper>
      </UpdateResourceModalContainer>
    </Modal>
  );
}
