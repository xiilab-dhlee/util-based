"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useGetPresetDetail } from "@/api/generated/admin-resource-preset/admin-resource-preset";
import type { ResourcePresetUpdateRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { GpuResponseGpuType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ResourcePresetDetailUpdate } from "@/domain/resource-preset/components/detail/resource-preset-detail-update";
import { ResourcePresetDetailView } from "@/domain/resource-preset/components/detail/resource-preset-detail-view";
import { CREATE_RESOURCE_PRESET_FORM_DEFAULT_VALUES } from "@/domain/resource-preset/constants/create-resource-preset-form.constant";
import { CREATE_RESOURCE_PRESET_FORM_ERROR_MESSAGES } from "@/domain/resource-preset/constants/create-resource-preset-form-error-message";
import { useUpdatePresetAction } from "@/domain/resource-preset/hooks/preset-action";
import { mapPresetDetailToUpdateForm } from "@/domain/resource-preset/utils/update-resource-preset-form.mapper";
import {
  type UpdatePresetBodyExtended,
  updatePresetBodyExtended,
} from "@/domain/resource-preset/utils/update-resource-preset-form.override.zod";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { RESOURCE_PRESET_EVENTS } from "@/shared/constants/pubsub.constant";
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
  const presetIdParam = params.id;
  const publish = usePublish();

  // View/Update 모드 상태 관리
  const [mode, setMode] = useState<"view" | "update">("view");
  const [isNormalGpuListEnabled, setIsNormalGpuListEnabled] = useState(false);

  const numericPresetId = Number(presetIdParam);
  const hasValidPresetId =
    Number.isFinite(numericPresetId) && Number(numericPresetId) > 0;

  const { data: presetDetail } = useGetPresetDetail(
    hasValidPresetId ? numericPresetId : 0,
    {
      query: { enabled: hasValidPresetId },
    },
  );

  const updatePreset = useUpdatePresetAction();

  const formMethods = useForm<UpdatePresetBodyExtended>({
    resolver: zodResolver(updatePresetBodyExtended),
    defaultValues: CREATE_RESOURCE_PRESET_FORM_DEFAULT_VALUES,
  });

  const handleNormalGpuListEnabledChange = (checked: boolean) => {
    setIsNormalGpuListEnabled(checked);
  };

  const getNormalGpuListEnabled = () => {
    const gpu = presetDetail?.resource.gpu;

    return gpu?.gpuType === GpuResponseGpuType.NORMAL && Boolean(gpu?.gpuName);
  };

  const resetFormWithDetail = () => {
    if (!presetDetail) {
      return;
    }

    formMethods.reset(mapPresetDetailToUpdateForm(presetDetail));
    setIsNormalGpuListEnabled(getNormalGpuListEnabled());
  };

  const toResourcePresetUpdateRequest = (
    data: UpdatePresetBodyExtended,
  ): ResourcePresetUpdateRequest | null => {
    const parsed = updatePresetBodyExtended.safeParse(data);
    if (!parsed.success) {
      return null;
    }

    const normalizedDescription = parsed.data.description?.trim() || undefined;
    const normalizedGpuName =
      parsed.data.resource.gpu?.gpuName?.trim() || undefined;
    const normalizedGpu = parsed.data.resource.gpu
      ? {
          ...parsed.data.resource.gpu,
          gpuName: normalizedGpuName,
        }
      : undefined;

    return {
      presetName: parsed.data.presetName,
      description: normalizedDescription,
      resource: {
        cpu: { requestCore: parsed.data.resource.cpu.requestCore },
        memory: { requestByte: parsed.data.resource.memory.requestByte },
        gpu: normalizedGpu,
      },
      workloadJobType: parsed.data.workloadJobType,
      nodeType: parsed.data.nodeType,
    };
  };

  /**
   * 수정 모드 진입 핸들러
   * GPU/Node 매칭 후 폼 초기화
   */
  const handleUpdate = () => {
    if (!presetDetail) {
      toast.error("데이터를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    resetFormWithDetail();
    setMode("update");
  };

  const handleSubmit = (data: UpdatePresetBodyExtended) => {
    if (!hasValidPresetId) {
      toast.error("리소스 프리셋 ID가 없습니다.");
      return;
    }

    const request = toResourcePresetUpdateRequest(data);
    if (!request) {
      toast.error("입력값을 확인해주세요.");
      return;
    }

    updatePreset.mutate(
      {
        resourcePresetId: numericPresetId,
        data: request,
      },
      {
        onSuccess: () => {
          setMode("view");
        },
      },
    );
  };

  const handleInvalid = () => {
    const gpu = formMethods.getValues("resource.gpu");
    const shouldRequireGpuName =
      Boolean(gpu) &&
      gpu?.gpuType === GpuResponseGpuType.NORMAL &&
      isNormalGpuListEnabled;

    if (shouldRequireGpuName && !gpu?.gpuName) {
      formMethods.setError("resource.gpu.gpuName", {
        type: "manual",
        message:
          CREATE_RESOURCE_PRESET_FORM_ERROR_MESSAGES.resource.gpu.gpuName
            .required,
      });
    }
  };

  const handleSave = formMethods.handleSubmit(handleSubmit, handleInvalid);

  const resetFormToDefault = () => {
    formMethods.reset(CREATE_RESOURCE_PRESET_FORM_DEFAULT_VALUES);
    setIsNormalGpuListEnabled(false);
  };

  /**
   * 취소 핸들러
   */
  const handleCancel = () => {
    if (presetDetail) {
      resetFormWithDetail();
      setMode("view");
      return;
    }

    resetFormToDefault();
    setMode("view");
  };

  /**
   * 삭제 핸들러
   */
  const handleDelete = () => {
    if (!hasValidPresetId) {
      toast.error("리소스 프리셋 ID가 없습니다.");
      return;
    }
    publish(RESOURCE_PRESET_EVENTS.sendDeleteResourcePreset, numericPresetId);
  };

  return (
    <AsideDetailContainer>
      {!presetDetail ? (
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
          data={presetDetail}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ) : (
        <FormProvider {...formMethods}>
          <ResourcePresetDetailUpdate
            onCancel={handleCancel}
            onSave={handleSave}
            isSaving={updatePreset.isPending}
            isNormalGpuListEnabled={isNormalGpuListEnabled}
            onChangeNormalGpuListEnabled={handleNormalGpuListEnabledChange}
          />
        </FormProvider>
      )}
    </AsideDetailContainer>
  );
}
