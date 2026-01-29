"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Icon, Modal, TextArea } from "xiilab-ui";
import { z } from "zod";

import {
  useGetClusterTotalResources,
  useGetMigProfiles,
} from "@/api/generated/cluster-resource/cluster-resource";
import {
  type CreateResourceRequestMutationBody,
  getGetResourceRequestsQueryKey,
  useCreateResourceRequest,
  useGetWorkspaceResources,
} from "@/api/generated/workspace/workspace";
import {
  createResourceRequestBody,
  createResourceRequestBodyRequestReasonMax,
} from "@/api/generated/workspace/workspace.zod";
import { openCreateResourceRequestModalAtom } from "@/domain/setting/state/setting.atom";
import {
  type MigResourceType,
  migResourceSchema,
} from "@/domain/system-setting/schemas/workspace-resource-setting.schema";
import {
  MigFormField,
  type MigFormFieldProps,
} from "@/shared/components/form/mig-form-field";
import { Slider } from "@/shared/components/slider";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
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

const createResourceRequestFormSchema = z.object({
  gpu: z.number().min(0),
  cpu: z.number().min(1, "CPU는 필수값입니다."),
  memory: z.number().min(1, "Memory는 필수값입니다."),
  reason: z
    .string()
    .nonempty("리소스 요청 사유를 입력해 주세요.")
    .max(
      createResourceRequestBodyRequestReasonMax,
      `요청 사유는 최대 ${createResourceRequestBodyRequestReasonMax}자까지 입력할 수 있습니다.`,
    ),
  migResources: z.array(migResourceSchema).optional(),
});

type CreateResourceRequestFormType = z.infer<
  typeof createResourceRequestFormSchema
>;

export function CreateResourceSettingModal() {
  const { open, onClose } = useGlobalModal(openCreateResourceRequestModalAtom);
  const queryClient = useQueryClient();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId ?? null;

  const { data: clusterResources } = useGetClusterTotalResources();
  const { data: migProfiles } = useGetMigProfiles();

  const { data: workspaceResourceData } = useGetWorkspaceResources(
    workspaceId ?? 0,
    {
      query: {
        enabled: open && !!workspaceId,
      },
    },
  );

  const createResourceRequestMutation = useCreateResourceRequest();
  const isPending = createResourceRequestMutation.isPending;

  const defaultValues = useMemo<CreateResourceRequestFormType>(
    () => ({
      gpu: 0,
      cpu: 0,
      memory: 0,
      reason: "",
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
  } = useForm<CreateResourceRequestFormType>({
    resolver: zodResolver(createResourceRequestFormSchema),
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

  const initialValues = useMemo<CreateResourceRequestFormType | null>(() => {
    if (!workspaceResourceData) return null;

    const memoryValue = convertBytes(
      Number(workspaceResourceData.memory.quotaByte),
      "GB",
      0,
    ).value;

    return {
      gpu: workspaceResourceData.gpu.detail.normal.quotaCount ?? 0,
      cpu: workspaceResourceData.cpu.quotaCore ?? 0,
      memory: memoryValue,
      reason: "",
      migResources:
        workspaceResourceData.gpu.detail.mig
          ?.filter(
            (mig) => Number.isFinite(mig.quotaCount) && mig.quotaCount > 0,
          )
          .map((mig) => ({
            profile: mig.profile,
            count: String(mig.quotaCount),
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

  const onSubmit = (data: CreateResourceRequestFormType) => {
    if (!workspaceId) {
      toast.error("워크스페이스가 선택되지 않았습니다.");
      return;
    }

    const hasMigResources = (data.migResources?.length ?? 0) > 0;
    const hasGpuDetail = data.gpu > 0 || hasMigResources;
    const memoryByte = convertToBytes(data.memory, "GB");

    const payload: CreateResourceRequestMutationBody = {
      resource: {
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
      },
      requestReason: data.reason,
    };

    const parsed = createResourceRequestBody.safeParse(payload);
    if (!parsed.success) {
      toast.error("입력값을 확인해 주세요.");
      return;
    }

    createResourceRequestMutation.mutate(
      { workspaceId, data: parsed.data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetResourceRequestsQueryKey(workspaceId),
          });
          handleClose();
        },
      },
    );
  };

  if (!open) return null;

  return (
    <Modal
      title="리소스 요청"
      open={open}
      onCancel={handleClose}
      modalWidth={370}
      centered
      showHeaderBorder
      icon={<Icon name="Request" size={20} color="#FFF" />}
      type="primary"
      okText="리소스 요청"
      cancelText="취소"
      onOk={handleSubmit(onSubmit)}
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      cancelButtonProps={{ disabled: isPending }}
      okButtonProps={{ disabled: isPending }}
      confirmLoading={isPending}
    >
      <UpdateResourceModalContainer>
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

        <ReasonSection>
          <ReasonLabel className="required">요청 사유</ReasonLabel>
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <TextArea
                value={field.value}
                onChange={field.onChange}
                placeholder="리소스 요청 사유를 입력해 주세요."
                rows={4}
                maxLength={createResourceRequestBodyRequestReasonMax}
                status={errors.reason ? "error" : undefined}
                style={{
                  width: "100%",
                  resize: "none",
                }}
                disabled={isPending}
              />
            )}
          />
          {errors.reason?.message && (
            <UpdateResourceModalErrorMessage>
              {errors.reason.message}
            </UpdateResourceModalErrorMessage>
          )}
        </ReasonSection>
      </UpdateResourceModalContainer>
    </Modal>
  );
}

const ReasonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const ResourceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReasonLabel = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  color: #000;
  ${requiredTextStyle}

  &.required::after {
    left: 16%;
    transform: translateY(-50%);
    padding-top: 0;
  }
`;

const RequiredResourceTitle = styled(UpdateResourceModalResourceTitle)`
  ${requiredTextStyle}
`;
