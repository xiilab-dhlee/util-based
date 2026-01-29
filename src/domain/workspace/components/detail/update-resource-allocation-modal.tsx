"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Icon, Modal } from "xiilab-ui";
import { z } from "zod";

import {
  getGetAdminWorkspaceDetailQueryKey,
  type UpdateWorkspaceResourceMutationBody,
  useGetAdminWorkspaceDetail,
  useUpdateWorkspaceResource,
} from "@/api/generated/admin-workspace/admin-workspace";
import { updateWorkspaceResourceBody } from "@/api/generated/admin-workspace/admin-workspace.zod";
import {
  useGetClusterTotalResources,
  useGetMigProfiles,
} from "@/api/generated/cluster-resource/cluster-resource";
import {
  type MigResourceType,
  migResourceSchema,
} from "@/domain/system-setting/schemas/workspace-resource-setting.schema";
import { openUpdateResourceAllocationModalAtom } from "@/domain/workspace/state/workspace.atom";
import {
  MigFormField,
  type MigFormFieldProps,
} from "@/shared/components/form/mig-form-field";
import { Slider } from "@/shared/components/slider";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { hasDuplicateMigProfile } from "@/shared/utils/mig-resource.util";
import { convertBytes, convertToBytes } from "@/shared/utils/resource.util";
import {
  UpdateResourceModalContainer,
  UpdateResourceModalErrorMessage,
  UpdateResourceModalResource,
  UpdateResourceModalResourceHeader,
  UpdateResourceModalResourceTitle,
} from "@/styles/layers/update-resource-modal-layers.styled";
import { requiredTextStyle } from "@/styles/mixins/text";

/**
 * 실제 API 응답 구조 (타입 정의와 실제 응답이 다름)
 */
interface ActualResourceResponse {
  gpu?: {
    quotaCount?: number;
    usedCount?: number;
    requestCount?: number;
    utilization?: number;
    detail?: {
      normal?: {
        quotaCount?: number;
        usedCount?: number;
        requestCount?: number;
      };
      mig?: Array<{
        profile: string;
        quotaCount?: number;
        usedCount?: number;
        requestCount?: number;
      }>;
    };
  };
  cpu?: {
    quotaCore?: number;
    usedCore?: number;
    requestCore?: number;
    utilization?: number;
  };
  memory?: {
    quotaByte?: number;
    usedByte?: number;
    requestByte?: number;
    utilization?: number;
  };
}

const updateResourceAllocationFormSchema = z.object({
  gpu: z.number().min(0),
  cpu: z.number().min(1, "CPU는 필수값입니다."),
  memory: z.number().min(1, "Memory는 필수값입니다."),
  migResources: z.array(migResourceSchema).optional(),
});

type UpdateResourceAllocationFormType = z.infer<
  typeof updateResourceAllocationFormSchema
>;

/**
 * 리소스 할당량 수정 모달 컴포넌트
 *
 * 워크스페이스의 리소스 할당량을 수정할 수 있는 모달입니다.
 * GPU, CPU, MEM, MIG 리소스의 할당량을 프로그레스 바와 함께 표시합니다.
 * PubSub 패턴을 사용하여 데이터를 전달받습니다.
 */
export function UpdateResourceAllocationModal() {
  const { open, onClose } = useGlobalModal(
    openUpdateResourceAllocationModalAtom,
  );
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const workspaceId = Number(id);
  const isValidWorkspaceId = Number.isFinite(workspaceId);

  const { data: clusterResources } = useGetClusterTotalResources({
    query: {
      enabled: open,
    },
  });
  const { data: migProfiles } = useGetMigProfiles({
    query: {
      enabled: open,
    },
  });
  const {
    data: workspaceDetail,
    isLoading: isLoadingWorkspaceResource,
    isError: isErrorWorkspaceResource,
  } = useGetAdminWorkspaceDetail(workspaceId, {
    query: {
      enabled: open && isValidWorkspaceId,
    },
  });

  const workspaceResourceData = workspaceDetail?.resource as
    | ActualResourceResponse
    | undefined;

  const updateWorkspaceResourceMutation = useUpdateWorkspaceResource();
  const isPending = updateWorkspaceResourceMutation.isPending;

  const defaultValues = useMemo<UpdateResourceAllocationFormType>(
    () => ({
      gpu: 0,
      cpu: 0,
      memory: 0,
      migResources: [],
    }),
    [],
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateResourceAllocationFormType>({
    resolver: zodResolver(updateResourceAllocationFormSchema),
    defaultValues,
  });

  const watchedMigResources = watch("migResources");
  const currentMigResources = useMemo<MigFormFieldProps["value"]>(
    () =>
      (watchedMigResources ?? []).map((mig) => ({
        profile: mig.profile ?? "",
        count: mig.count ?? "",
      })),
    [watchedMigResources],
  );

  const clusterMaxValues = useMemo(() => {
    if (!clusterResources || !migProfiles) return null;

    return {
      gpuMax: clusterResources.gpu.clusterCapacityCount,
      cpuMax: clusterResources.cpu.clusterCapacityCores,
      memMax: convertBytes(
        Number(clusterResources.memory.clusterCapacityBytes),
        "GB",
        0,
      ).value,
      migProfileOptions: migProfiles.migProfiles.map((profile) => ({
        profile: profile.profile,
        availableCount: profile.maxCount,
      })),
    };
  }, [clusterResources, migProfiles]);

  const migProfileOptions = useMemo(
    () => clusterMaxValues?.migProfileOptions ?? [],
    [clusterMaxValues],
  );

  const initialValues = useMemo<UpdateResourceAllocationFormType | null>(() => {
    if (!workspaceResourceData) return null;

    const memoryValue = convertBytes(
      Number(workspaceResourceData?.memory?.quotaByte ?? 0),
      "GB",
      0,
    ).value;

    return {
      gpu: workspaceResourceData?.gpu?.detail?.normal?.quotaCount ?? 0,
      cpu: workspaceResourceData?.cpu?.quotaCore ?? 0,
      memory: memoryValue,
      migResources:
        workspaceResourceData?.gpu?.detail?.mig
          ?.filter(
            (mig) =>
              mig.quotaCount != null &&
              Number.isFinite(mig.quotaCount) &&
              mig.quotaCount > 0,
          )
          .map((mig) => ({
            profile: mig.profile,
            count: String(mig.quotaCount ?? 0),
          })) ?? [],
    };
  }, [workspaceResourceData]);

  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      hasInitializedRef.current = false;
      return;
    }

    if (!initialValues || hasInitializedRef.current) return;

    reset(initialValues);
    hasInitializedRef.current = true;
  }, [open, initialValues, reset]);

  const handleAddMigResource = useCallback(
    (migResource: MigResourceType) => {
      const currentList = currentMigResources ?? [];
      if (hasDuplicateMigProfile(currentList, migResource.profile)) {
        return false;
      }

      setValue("migResources", [...currentList, migResource], {
        shouldValidate: true,
      });
      return true;
    },
    [currentMigResources, setValue],
  );

  const handleUpdateMigResource = useCallback(
    (index: number, migResource: MigResourceType) => {
      const currentList = currentMigResources ?? [];
      if (hasDuplicateMigProfile(currentList, migResource.profile, index)) {
        return false;
      }

      const updatedList = currentList.map((item, i) =>
        i === index ? migResource : item,
      );
      setValue("migResources", updatedList, { shouldValidate: true });
      return true;
    },
    [currentMigResources, setValue],
  );

  const handleRemoveMigResource = useCallback(
    (index: number) => {
      const currentList = currentMigResources ?? [];
      setValue(
        "migResources",
        currentList.filter((_, i) => i !== index),
        { shouldValidate: true },
      );
    },
    [currentMigResources, setValue],
  );

  const handleClose = () => {
    if (isPending) return;
    reset(defaultValues);
    onClose();
  };

  const onSubmit = (data: UpdateResourceAllocationFormType) => {
    if (!isValidWorkspaceId) {
      toast.error("워크스페이스 정보가 올바르지 않습니다.");
      return;
    }

    const hasMigResources = (data.migResources?.length ?? 0) > 0;
    const hasGpuDetail = data.gpu > 0 || hasMigResources;
    const memoryByte = convertToBytes(data.memory, "GB");

    const payload: UpdateWorkspaceResourceMutationBody = {
      ...(hasGpuDetail && {
        gpu: {
          detail: {
            ...(data.gpu > 0 && {
              normal: { requestCount: data.gpu },
            }),
            ...(hasMigResources && {
              mig:
                data.migResources?.map((mig) => ({
                  profile: mig.profile,
                  requestCount: Number(mig.count),
                })) ?? [],
            }),
          },
        },
      }),
      cpu: { requestCore: data.cpu },
      memory: { requestByte: memoryByte },
    };

    const parsed = updateWorkspaceResourceBody.safeParse(payload);
    if (!parsed.success) {
      toast.error("입력값을 확인해 주세요.");
      return;
    }

    updateWorkspaceResourceMutation.mutate(
      { workspaceId, data: parsed.data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetAdminWorkspaceDetailQueryKey(workspaceId),
          });
          handleClose();
        },
      },
    );
  };

  if (!open) return null;

  const isDataLoading = isLoadingWorkspaceResource;
  const hasDataError = isErrorWorkspaceResource || !workspaceResourceData;

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit02" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      title="리소스 할당량 수정"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="리소스 수정"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      cancelButtonProps={{ disabled: isPending }}
      okButtonProps={{ disabled: isPending || isDataLoading || hasDataError }}
      confirmLoading={isPending}
    >
      <UpdateResourceModalContainer>
        {isDataLoading && (
          <LoadingContainer>
            <LoadingMessage>리소스 정보를 불러오는 중...</LoadingMessage>
          </LoadingContainer>
        )}
        {!isDataLoading && hasDataError && (
          <ErrorContainer>
            <ErrorMessage>리소스 정보를 불러오는데 실패했습니다.</ErrorMessage>
          </ErrorContainer>
        )}
        {!isDataLoading && !hasDataError && (
          <ResourceList>
            <UpdateResourceModalResource>
              <UpdateResourceModalResourceHeader>
                <UpdateResourceModalResourceTitle>
                  GPU
                </UpdateResourceModalResourceTitle>
              </UpdateResourceModalResourceHeader>
              <Controller
                name="gpu"
                control={control}
                render={({ field }) => (
                  <Slider
                    min={0}
                    max={clusterMaxValues?.gpuMax}
                    value={field.value}
                    onChange={field.onChange}
                    type="GPU"
                    width="100%"
                    disabled={isPending}
                  />
                )}
              />
            </UpdateResourceModalResource>

            <UpdateResourceModalResource>
              <UpdateResourceModalResourceHeader>
                <UpdateResourceModalResourceTitle>
                  MIG
                </UpdateResourceModalResourceTitle>
              </UpdateResourceModalResourceHeader>
              <MigFormField
                value={currentMigResources}
                migProfileOptions={migProfileOptions}
                onAdd={handleAddMigResource}
                onUpdate={handleUpdateMigResource}
                onRemove={handleRemoveMigResource}
                disabled={isPending}
              />
            </UpdateResourceModalResource>

            <UpdateResourceModalResource>
              <UpdateResourceModalResourceHeader>
                <RequiredResourceTitle className="required">
                  CPU
                </RequiredResourceTitle>
              </UpdateResourceModalResourceHeader>
              <Controller
                name="cpu"
                control={control}
                render={({ field }) => (
                  <Slider
                    min={0}
                    max={clusterMaxValues?.cpuMax}
                    value={field.value}
                    onChange={field.onChange}
                    type="CPU"
                    width="100%"
                    disabled={isPending}
                    error={!!errors.cpu}
                  />
                )}
              />
              {errors.cpu?.message && (
                <UpdateResourceModalErrorMessage>
                  {errors.cpu.message}
                </UpdateResourceModalErrorMessage>
              )}
            </UpdateResourceModalResource>

            <UpdateResourceModalResource>
              <UpdateResourceModalResourceHeader>
                <RequiredResourceTitle className="required">
                  Memory
                </RequiredResourceTitle>
              </UpdateResourceModalResourceHeader>
              <Controller
                name="memory"
                control={control}
                render={({ field }) => (
                  <Slider
                    min={0}
                    max={clusterMaxValues?.memMax}
                    value={field.value}
                    onChange={field.onChange}
                    type="MEM"
                    width="100%"
                    disabled={isPending}
                    error={!!errors.memory}
                  />
                )}
              />
              {errors.memory?.message && (
                <UpdateResourceModalErrorMessage>
                  {errors.memory.message}
                </UpdateResourceModalErrorMessage>
              )}
            </UpdateResourceModalResource>
          </ResourceList>
        )}
      </UpdateResourceModalContainer>
    </Modal>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const ResourceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RequiredResourceTitle = styled(UpdateResourceModalResourceTitle)`
  ${requiredTextStyle}
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
`;

const LoadingMessage = styled.div`
  color: #666;
  font-size: 14px;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 14px;
  text-align: center;
`;
