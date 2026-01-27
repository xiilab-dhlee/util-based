"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Form, FormItem, Icon, InputNumber, Modal } from "xiilab-ui";

import {
  useGetClusterTotalResources,
  useGetMigProfiles,
} from "@/api/generated/cluster-resource/cluster-resource";
import { useUpdatePolicySetAction } from "@/domain/system-setting/hooks/system-setting-actions";
import {
  type MigResourceTypeExtended,
  type WorkspaceResourceSettingFormTypeExtended,
  workspaceResourceSettingFormSchemaExtended,
} from "@/domain/system-setting/utils/workspace-resource-setting-form.override.zod";
import { MigFormField } from "@/shared/components/form/mig-form-field";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { hasDuplicateMigProfile } from "@/shared/utils/mig-resource.util";
import {
  convertBytes,
  convertToBytes,
  getResourceInfo,
} from "@/shared/utils/resource.util";
import { errorTextStyle } from "@/styles/mixins/text";

// ===== 컴포넌트 =====

/**
 * 워크스페이스 리소스 설정 모달
 *
 * PubSub 패턴을 사용하여 모달을 열고 리소스 설정을 수정합니다.
 */
export function WorkspaceResourceSettingModal() {
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit: handleFormSubmit,
    reset: resetForm,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WorkspaceResourceSettingFormTypeExtended>({
    resolver: zodResolver(workspaceResourceSettingFormSchemaExtended),
    defaultValues: {
      gpu: "0",
      cpu: "0",
      memory: "0",
      workspaceCount: "0",
      migResources: [],
    },
  });

  // 클러스터 자원 조회
  const { data: clusterResources } = useGetClusterTotalResources();
  const { data: migProfiles } = useGetMigProfiles();

  // Mutation hook (action으로 래핑됨)
  const { mutate, isPending } = useUpdatePolicySetAction();
  const isFormDisabled = isPending;

  // 현재 MIG 리소스 감시
  const currentMigResources = watch("migResources");

  // 클러스터 최대값 및 MIG 옵션 준비
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
      migProfileOptions: migProfiles.migProfiles.map((p) => ({
        profile: p.profile,
        availableCount: p.maxCount,
      })),
    };
  }, [clusterResources, migProfiles]);

  // 클러스터에 없는 MIG 프로필 검증
  const invalidMigProfiles = useMemo(() => {
    if (!clusterMaxValues || !currentMigResources) return [];

    const clusterProfiles = new Set(
      clusterMaxValues.migProfileOptions.map((opt) => opt.profile),
    );

    return currentMigResources
      .filter((mig) => !clusterProfiles.has(mig.profile))
      .map((mig) => mig.profile);
  }, [clusterMaxValues, currentMigResources]);

  // 에러 상태: 클러스터에 없는 MIG 프로필이 있는지
  const hasMigProfileError = invalidMigProfiles.length > 0;

  // MIG 개수가 max를 초과하는지 검증
  const hasMigCountError = useMemo(() => {
    if (!clusterMaxValues || !currentMigResources) return false;

    return currentMigResources.some((mig) => {
      const maxCount = clusterMaxValues.migProfileOptions.find(
        (opt) => opt.profile === mig.profile,
      )?.availableCount;

      if (maxCount === undefined) return false;

      const numericCount = Number(mig.count);
      return !Number.isNaN(numericCount) && numericCount > maxCount;
    });
  }, [clusterMaxValues, currentMigResources]);

  // 현재 값들 감시
  const currentGpu = watch("gpu");
  const currentCpu = watch("cpu");
  const currentMemory = watch("memory");

  // 클러스터 최대값 초과 검증
  const capacityErrors = useMemo(() => {
    if (!clusterMaxValues) return {};

    return {
      gpu: Number(currentGpu) > clusterMaxValues.gpuMax,
      cpu: Number(currentCpu) > clusterMaxValues.cpuMax,
      memory: Number(currentMemory) > clusterMaxValues.memMax,
    };
  }, [clusterMaxValues, currentGpu, currentCpu, currentMemory]);

  // 용량 초과 에러가 있는지
  const hasCapacityError =
    capacityErrors.gpu || capacityErrors.cpu || capacityErrors.memory;

  // PubSub 구독 - 모달 열기 이벤트
  useSubscribe<WorkspaceResourceSettingFormTypeExtended>(
    SYSTEM_SETTING_EVENTS.openWorkspaceResourceSettingModal,
    useCallback(
      (data) => {
        resetForm(data);
        setOpen(true);
      },
      [resetForm],
    ),
  );

  // MIG 리소스 추가
  const handleAddMigResource = useCallback(
    (migResource: MigResourceTypeExtended) => {
      const currentList = currentMigResources ?? [];

      // 중복 체크
      if (hasDuplicateMigProfile(currentList, migResource.profile)) {
        return false;
      }

      setValue("migResources", [...currentList, migResource]);
      return true;
    },
    [currentMigResources, setValue],
  );

  // MIG 리소스 수정
  const handleUpdateMigResource = useCallback(
    (index: number, migResource: MigResourceTypeExtended) => {
      const currentList = currentMigResources ?? [];

      // 중복 체크 (자기 자신 제외)
      if (hasDuplicateMigProfile(currentList, migResource.profile, index)) {
        return false;
      }

      const updatedList = currentList.map((item, i) =>
        i === index ? migResource : item,
      );
      setValue("migResources", updatedList);
      return true;
    },
    [currentMigResources, setValue],
  );

  // MIG 리소스 제거
  const handleRemoveMigResource = useCallback(
    (index: number) => {
      const currentList = currentMigResources ?? [];
      setValue(
        "migResources",
        currentList.filter((_, i) => i !== index),
      );
    },
    [currentMigResources, setValue],
  );

  /**
   * 모달 취소
   */
  const handleCancel = () => {
    if (isPending) return;
    resetForm({
      gpu: "0",
      cpu: "0",
      memory: "0",
      workspaceCount: "0",
      migResources: [],
    });
    setOpen(false);
  };

  /**
   * 폼 제출
   */
  const onSubmit = (data: WorkspaceResourceSettingFormTypeExtended) => {
    // 클러스터 최대값 검증
    if (!clusterMaxValues) return;

    // 에러가 있으면 제출 중단
    if (hasMigProfileError || hasMigCountError || hasCapacityError) {
      return;
    }

    const gpuCount = Number(data.gpu ?? 0);
    const cpuCore = Number(data.cpu);
    const memoryGB = Number(data.memory);

    // Memory GB → Byte 변환
    const memoryByte = convertToBytes(memoryGB, "GB");

    // AdminPolicySetRequest 형식으로 payload 생성
    const hasMigResources = (data.migResources?.length ?? 0) > 0;
    const hasGpuDetail = gpuCount > 0 || hasMigResources;

    const payload = {
      resource: {
        ...(hasGpuDetail && {
          gpu: {
            detail: {
              ...(gpuCount > 0 && {
                normal: { requestCount: gpuCount },
              }),
              ...(hasMigResources && {
                mig: data.migResources?.map((mig) => ({
                  profile: mig.profile,
                  requestCount: Number(mig.count),
                })),
              }),
              // mps는 사용하지 않으므로 undefined (보내지 않음)
            },
          },
        }),
        cpu: {
          requestCore: cpuCore,
        },
        memory: {
          requestByte: memoryByte,
        },
      },
      workspaceLimitCount: Number(data.workspaceCount),
    };

    // Mutation 실행
    mutate(
      { data: payload },
      {
        onSuccess: () => {
          handleCancel();
        },
      },
    );
  };

  if (!open) return null;

  const gpuInfo = getResourceInfo("GPU");
  const cpuInfo = getResourceInfo("CPU");
  const memInfo = getResourceInfo("MEM");
  const migInfo = getResourceInfo("MIG");

  // 클러스터 자원 로딩 중이면 모달 표시 안 함
  if (!clusterMaxValues) return null;

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit01" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable={!isPending}
      title="워크스페이스 및 리소스 설정"
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="저장"
      onOk={handleFormSubmit(onSubmit)}
      confirmLoading={isPending}
      centered
      showHeaderBorder
      maskClosable={!isPending}
      keyboard={!isPending}
      cancelButtonProps={{ disabled: isPending }}
      okButtonProps={{
        disabled:
          hasMigProfileError ||
          hasMigCountError ||
          hasCapacityError ||
          isPending,
      }}
    >
      <Form layout="vertical">
        {/* GPU */}
        <Controller
          name="gpu"
          control={control}
          render={({ field }) => (
            <FormItem
              label={`${gpuInfo.text} (${gpuInfo.unit})`}
              help={
                errors.gpu?.message ||
                (capacityErrors.gpu
                  ? `GPU 개수가 클러스터 용량(${clusterMaxValues.gpuMax})을 초과합니다.`
                  : undefined)
              }
              validateStatus={
                errors.gpu || capacityErrors.gpu ? "error" : undefined
              }
            >
              <InputNumber
                placeholder="GPU 개수를 입력해 주세요."
                value={field.value}
                onChange={(value) => field.onChange(String(value ?? ""))}
                status={errors.gpu || capacityErrors.gpu ? "error" : undefined}
                width="100%"
                height="30px"
                min={0}
                max={clusterMaxValues.gpuMax}
                controls={true}
                disabled={isFormDisabled}
              />
            </FormItem>
          )}
        />

        {/* MIG */}
        <FormItem
          label={`${migInfo.text} (${migInfo.unit})`}
          status={
            errors.migResources || hasMigProfileError ? "error" : undefined
          }
        >
          <MigFormField
            value={currentMigResources ?? []}
            migProfileOptions={clusterMaxValues.migProfileOptions}
            error={errors.migResources?.message}
            onAdd={handleAddMigResource}
            onUpdate={handleUpdateMigResource}
            onRemove={handleRemoveMigResource}
            disabled={isFormDisabled}
          />
          {hasMigProfileError && (
            <ErrorMessage>
              클러스터에 존재하지 않는 MIG 프로파일이 포함되어 있습니다.
            </ErrorMessage>
          )}
        </FormItem>

        {/* CPU */}
        <Controller
          name="cpu"
          control={control}
          render={({ field }) => (
            <FormItem
              label={`${cpuInfo.text} (${cpuInfo.unit})`}
              required
              help={
                errors.cpu?.message ||
                (capacityErrors.cpu
                  ? `CPU Core 수가 클러스터 용량(${clusterMaxValues.cpuMax})을 초과합니다.`
                  : undefined)
              }
              validateStatus={
                errors.cpu || capacityErrors.cpu ? "error" : undefined
              }
            >
              <InputNumber
                placeholder="CPU Core 수를 입력해 주세요."
                value={field.value}
                onChange={(value) => field.onChange(String(value ?? ""))}
                status={errors.cpu || capacityErrors.cpu ? "error" : undefined}
                width="100%"
                height="30px"
                min={1}
                max={clusterMaxValues.cpuMax}
                controls={true}
                disabled={isFormDisabled}
              />
            </FormItem>
          )}
        />

        {/* Memory */}
        <Controller
          name="memory"
          control={control}
          render={({ field }) => (
            <FormItem
              label={`${memInfo.text} (${memInfo.unit})`}
              required
              help={
                errors.memory?.message ||
                (capacityErrors.memory
                  ? `Memory 용량이 클러스터 용량(${clusterMaxValues.memMax} GB)을 초과합니다.`
                  : undefined)
              }
              validateStatus={
                errors.memory || capacityErrors.memory ? "error" : undefined
              }
            >
              <InputNumber
                placeholder="Memory 용량을 입력해 주세요."
                value={field.value}
                onChange={(value) => field.onChange(String(value ?? ""))}
                status={
                  errors.memory || capacityErrors.memory ? "error" : undefined
                }
                width="100%"
                height="30px"
                min={1}
                max={clusterMaxValues.memMax}
                controls={true}
                disabled={isFormDisabled}
              />
            </FormItem>
          )}
        />

        {/* 워크스페이스 최대 생성 개수 */}
        <Controller
          name="workspaceCount"
          control={control}
          render={({ field }) => (
            <FormItem
              label="워크스페이스 최대 생성 개수 (개수)"
              required
              help={errors.workspaceCount?.message}
              validateStatus={errors.workspaceCount ? "error" : undefined}
            >
              <InputNumber
                placeholder="워크스페이스 최대 생성 개수를 입력해 주세요."
                value={field.value}
                onChange={(value) => field.onChange(String(value ?? ""))}
                status={errors.workspaceCount ? "error" : undefined}
                width="100%"
                height="30px"
                min={1}
                controls={true}
                disabled={isFormDisabled}
              />
            </FormItem>
          )}
        />
      </Form>
    </Modal>
  );
}

// ===== Styled Components =====

const ErrorMessage = styled.div`
  ${errorTextStyle}
  margin-top: 4px;
`;
