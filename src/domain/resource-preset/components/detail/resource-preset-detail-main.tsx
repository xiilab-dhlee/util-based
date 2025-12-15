"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import { ResourcePresetDetailUpdate } from "@/domain/resource-preset/components/detail/resource-preset-detail-update";
import { ResourcePresetDetailView } from "@/domain/resource-preset/components/detail/resource-preset-detail-view";
import { useGetResourcePresetDetail } from "@/domain/resource-preset/hooks/use-get-resource-preset-detail";
import { useResourcePresetForm } from "@/domain/resource-preset/hooks/use-resource-preset-form";
import { useUpdateResourcePreset } from "@/domain/resource-preset/hooks/use-update-resource-preset";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { RESOURCE_PRESET_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGetGpuNodes } from "@/shared/hooks/use-get-gpu-nodes";
import { useGetGpus } from "@/shared/hooks/use-get-gpus";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  AsideDetailArticle,
  AsideDetailContainer,
  AsideDetailEmpty,
} from "@/styles/layers/aside-detail-layers.styled";

/**
 * 리소스 프리셋 상세 컴포넌트 (라우터)
 *
 * View/Update 모드를 전환하고, 두 컴포넌트 중 하나를 조건부 렌더링합니다.
 * URL params의 id를 통해 리소스 프리셋의 상세 정보를 관리합니다.
 */
export function ResourcePresetDetailMain() {
  const params = useParams<{ id: string }>();
  const presetId = params.id;
  const publish = usePublish();

  // View/Update 모드 상태 관리
  const [mode, setMode] = useState<"view" | "update">("view");

  const { data } = useGetResourcePresetDetail(presetId);
  const { data: gpuData } = useGetGpus();
  const { data: gpuNodeData } = useGetGpuNodes();

  // 폼 상태 및 메서드
  const { initForEdit, validate, reset } = useResourcePresetForm();
  const updateResourcePreset = useUpdateResourcePreset();

  /**
   * 수정 모드 진입 핸들러
   * GPU/Node 매칭 후 폼 초기화
   */
  const handleUpdate = () => {
    if (!data || !gpuData) {
      toast.error("데이터를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // GPU 목록에서 매칭
    const matchedGpu =
      gpuData.content.find((gpu) => gpu.name === data.gpuName) ?? null;

    // Node 매칭 (첫 번째 노드 사용)
    const matchedNode =
      matchedGpu && gpuNodeData
        ? (gpuNodeData.content.find(
            (node) =>
              node.gpuId === matchedGpu.id &&
              node.name === data.nodes[0]?.nodeName,
          ) ?? null)
        : null;

    // 폼 초기화 (atom에 기존 데이터 저장)
    initForEdit({
      detail: {
        name: data.name,
        description: data.description,
        jobType: data.jobType,
        nodeType: data.nodeType,
        gpuType: data.gpuType,
        gpu: data.gpu,
        cpu: data.cpu,
        memory: data.memory,
      },
      matchedGpu,
      matchedNode,
      matchedProfile: null, // MIG 프로필은 현재 지원하지 않음
    });

    setMode("update");
  };

  /**
   * 저장 핸들러
   */
  const handleSave = () => {
    const payload = validate();
    if (!payload) {
      return;
    }

    updateResourcePreset.mutate(
      { id: presetId, payload },
      {
        onSuccess: () => {
          toast.success("리소스 프리셋이 수정되었습니다.");
          setMode("view");
        },
      },
    );
  };

  /**
   * 취소 핸들러
   */
  const handleCancel = () => {
    reset();
    setMode("view");
  };

  /**
   * 삭제 핸들러
   */
  const handleDelete = () => {
    publish(RESOURCE_PRESET_EVENTS.sendDeleteResourcePreset, presetId);
  };

  return (
    <AsideDetailContainer>
      {!data ? (
        <AsideDetailArticle>
          <AsideDetailEmpty>
            <EmptyState
              title="선택된 리소스 프리셋이 없습니다"
              content="좌측 목록에서 리소스 프리셋을 선택해주세요."
            />
          </AsideDetailEmpty>
        </AsideDetailArticle>
      ) : mode === "view" ? (
        <ResourcePresetDetailView
          data={data}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ) : (
        <ResourcePresetDetailUpdate
          onCancel={handleCancel}
          onSave={handleSave}
          isSaving={updateResourcePreset.isPending}
        />
      )}
    </AsideDetailContainer>
  );
}
