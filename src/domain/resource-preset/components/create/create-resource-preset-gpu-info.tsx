"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import styled from "styled-components";
import { Form, FormItem, Icon, Switch } from "xiilab-ui";

import {
  GetGpuListGpuType,
  GetPresetsNodeType,
  GpuResponseGpuType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  useGetGpuList,
  useGetMigProfilesByGpu,
} from "@/api/generated/cluster-resource/cluster-resource";
import { MigProfileSelectDropdown } from "@/domain/resource-preset/components/create/dropdowns/mig-profile-select-dropdown";
import {
  GPU_TYPE_OPTIONS,
  type GpuUiType,
  getGpuSelectLabel,
  NODE_TYPE_OPTIONS,
} from "@/domain/resource-preset/constants/gpu-info.constant";
import type { CreatePresetBodyExtended } from "@/domain/resource-preset/utils/create-resource-preset-form.override.zod";
import {
  isMultiNodeEnabled,
  isNormalGpuOnlyInBatchMulti,
} from "@/domain/resource-preset/utils/resource-preset.rules";
import { SelectableBox } from "@/shared/components/selectable-box";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import {
  FormSectionContainer,
  FormSectionHeader,
} from "@/styles/layers/form-layer.styled";

interface CreateResourcePresetGpuInfoProps {
  isNormalGpuListEnabled: boolean;
  onChangeNormalGpuListEnabled: (checked: boolean) => void;
}

const isStringArray = (data: unknown): data is string[] =>
  Array.isArray(data) && data.every((item) => typeof item === "string");

const mapMigProfileResponse = (data: unknown): string[] =>
  isStringArray(data) ? data : [];

export function CreateResourcePresetGpuInfo({
  isNormalGpuListEnabled,
  onChangeNormalGpuListEnabled,
}: CreateResourcePresetGpuInfoProps) {
  const {
    setValue,
    control,
    formState: { errors },
  } = useFormContext<CreatePresetBodyExtended>();

  // 폼 값 구독
  const workloadJobType = useWatch({ control, name: "workloadJobType" });
  const nodeType = useWatch({ control, name: "nodeType" });
  const gpu = useWatch({ control, name: "resource.gpu" });
  const gpuType = useWatch({ control, name: "resource.gpu.gpuType" });
  const gpuName = useWatch({ control, name: "resource.gpu.gpuName" });
  const migProfile = useWatch({
    control,
    name: "resource.gpu.detail.mig.0.profile",
  });

  const isGpuUnused = gpu === null;

  const isBatchMultiNormalOnly = isNormalGpuOnlyInBatchMulti(
    workloadJobType,
    nodeType,
  );

  const selectedGpuUiType: GpuUiType = isGpuUnused
    ? "NONE"
    : (gpuType ?? GpuResponseGpuType.NORMAL);

  const effectiveGpuType = isBatchMultiNormalOnly
    ? GpuResponseGpuType.NORMAL
    : (gpuType ?? GpuResponseGpuType.NORMAL);

  // GPU 목록 조회 (Orval 훅 사용)
  const shouldFetchNormalGpuList =
    !isGpuUnused &&
    isNormalGpuListEnabled &&
    effectiveGpuType === GpuResponseGpuType.NORMAL;
  const shouldFetchMigGpuList = effectiveGpuType === GpuResponseGpuType.MIG;

  const { data: normalGpuData } = useGetGpuList(
    { gpuType: GetGpuListGpuType.NORMAL },
    { query: { enabled: shouldFetchNormalGpuList } },
  );
  const { data: migGpuData } = useGetGpuList(
    { gpuType: GetGpuListGpuType.MIG },
    { query: { enabled: shouldFetchMigGpuList } },
  );

  const normalGpuNames = normalGpuData?.gpuNames ?? [];
  const migGpuNames = migGpuData?.gpuNames ?? [];

  // 현재 선택된 GPU 타입에 따른 GPU 목록
  const currentGpuNames =
    effectiveGpuType === GpuResponseGpuType.MIG
      ? migGpuNames
      : isNormalGpuListEnabled && !isGpuUnused
        ? normalGpuNames
        : [];

  // MIG 프로필 조회 (MIG 타입이고 GPU가 선택된 경우에만)
  const { data: migProfilesResponse, isLoading: isLoadingProfiles } =
    useGetMigProfilesByGpu<string[]>(
      { gpuName: gpuName ?? "" },
      {
        query: {
          enabled:
            Boolean(gpuName) && effectiveGpuType === GpuResponseGpuType.MIG,
          select: mapMigProfileResponse,
        },
      },
    );

  const migProfileOptions = migProfilesResponse ?? [];

  // 비즈니스 룰 적용
  const isMultiNodeDisabled = !isMultiNodeEnabled(workloadJobType);

  // MIG일 때는 프로필 드롭다운
  const isMigType = effectiveGpuType === GpuResponseGpuType.MIG;
  const gpuNameError = errors.resource?.gpu?.gpuName?.message;
  const migProfileError = errors.resource?.gpu?.detail?.mig?.message;
  const gpuSelectErrorMessage = gpuNameError ?? migProfileError;
  const hasGpuSelectContent =
    currentGpuNames.length > 0 || (gpuName && isMigType);
  const isGpuSelectCompact = !hasGpuSelectContent && !gpuSelectErrorMessage;

  // 노드 타입 변경 핸들러
  const handleNodeTypeChange = (type: GetPresetsNodeType) => {
    setValue("nodeType", type);
  };

  // GPU 타입 변경 핸들러
  const handleGpuTypeChange = (newGpuType: GpuUiType) => {
    if (newGpuType === "NONE") {
      setValue("resource.gpu.detail.normal.requestCount", 0);
      setValue("resource.gpu.detail.mig.0.requestCount", 0);
      setValue("resource.gpu", null);
      onChangeNormalGpuListEnabled(false);
      return;
    }

    const selectedMigGpuName =
      newGpuType === GpuResponseGpuType.MIG ? migGpuNames[0] : undefined;

    setValue("resource.gpu", {
      gpuType: newGpuType,
      gpuName: selectedMigGpuName,
      detail: {
        normal: undefined,
        mig: undefined,
        mps: undefined,
      },
    });
  };

  // GPU 선택/해제 핸들러
  const handleClickGpu = (selectedGpuName: string) => {
    const isAlreadySelected = gpuName === selectedGpuName;
    setValue(
      "resource.gpu.gpuName",
      isAlreadySelected ? undefined : selectedGpuName,
    );
    // MIG 프로필 초기화
    if (effectiveGpuType === GpuResponseGpuType.MIG) {
      setValue("resource.gpu.detail.mig", undefined);
    }
  };

  // MIG 프로필 선택 핸들러
  const handleSelectMigProfile = (profileName: string) => {
    setValue("resource.gpu.detail.mig", [
      { profile: profileName, requestCount: 0 },
    ]);
  };

  // 특정 GPU 타입 옵션이 표시 가능한지 확인
  const isGpuTypeVisible = (type: GpuUiType) => {
    if (type === "NONE") return true;
    if (type === GpuResponseGpuType.MPS) return false;
    if (isBatchMultiNormalOnly) return type !== GpuResponseGpuType.MIG;
    if (type === GpuResponseGpuType.MIG) return migGpuNames.length > 0;
    return true;
  };

  useEffect(() => {
    if (!isBatchMultiNormalOnly) return;
    if (isGpuUnused) return;
    if (gpuType === GpuResponseGpuType.NORMAL) return;

    setValue("resource.gpu.gpuType", GpuResponseGpuType.NORMAL);
    setValue("resource.gpu.gpuName", undefined);
    setValue("resource.gpu.detail", {
      normal: undefined,
      mig: undefined,
      mps: undefined,
    });
  }, [gpuType, isBatchMultiNormalOnly, isGpuUnused, setValue]);

  useEffect(() => {
    if (isNormalGpuListEnabled) return;
    if (effectiveGpuType !== GpuResponseGpuType.NORMAL) return;
    if (!gpuName) return;

    setValue("resource.gpu.gpuName", undefined);
  }, [effectiveGpuType, gpuName, isNormalGpuListEnabled, setValue]);

  return (
    <FormSectionContainer>
      <FormSectionHeader>
        <CreateWorkloadSectionTitle>GPU 정보</CreateWorkloadSectionTitle>
      </FormSectionHeader>

      <Form layout="vertical">
        {/* 노드 타입 선택 */}
        <FormItem label="노드" required>
          <ButtonGrid $columns={2}>
            {NODE_TYPE_OPTIONS.map((option) => {
              const isSelected = nodeType === option.type;
              return (
                <SelectableBox
                  key={option.type}
                  icon={
                    <Icon
                      name={option.icon}
                      size={20}
                      color={isSelected ? "#154fed" : "#404040"}
                    />
                  }
                  title={option.label}
                  meta={<GuideTooltip title={option.tooltip} />}
                  isSelected={isSelected}
                  isDisabled={
                    option.type === GetPresetsNodeType.MULTI &&
                    isMultiNodeDisabled
                  }
                  onClick={() => handleNodeTypeChange(option.type)}
                />
              );
            })}
          </ButtonGrid>
        </FormItem>

        {/* GPU 형태 선택 */}
        <FormItem label="GPU 형태 선택" required>
          <ButtonGrid $columns={3}>
            {GPU_TYPE_OPTIONS.filter((option) =>
              isGpuTypeVisible(option.type),
            ).map((option) => (
              <SelectableBox
                key={option.type}
                title={option.label}
                isSelected={selectedGpuUiType === option.type}
                onClick={() => handleGpuTypeChange(option.type)}
              />
            ))}
          </ButtonGrid>
        </FormItem>

        {/* GPU 선택 */}
        <GpuSelectFormItem
          $isCompact={isGpuSelectCompact}
          label={
            <GpuSelectLabel>
              <span>{getGpuSelectLabel(selectedGpuUiType)}</span>
              {effectiveGpuType === GpuResponseGpuType.NORMAL &&
                !isGpuUnused && (
                  <GpuListSwitch>
                    <Switch
                      checked={isGpuUnused ? false : isNormalGpuListEnabled}
                      onChange={onChangeNormalGpuListEnabled}
                      disabled={isGpuUnused}
                    />
                  </GpuListSwitch>
                )}
            </GpuSelectLabel>
          }
          validateStatus={gpuSelectErrorMessage ? "error" : undefined}
          help={gpuSelectErrorMessage}
        >
          {hasGpuSelectContent && (
            <GpuSelectContainer>
              {/* GPU 카드 목록 - 메모리 정보 없이 이름만 표시 */}
              <ButtonGrid $columns={2}>
                {currentGpuNames.map((name) => (
                  <SelectableBox
                    key={name}
                    title={name}
                    isSelected={gpuName === name}
                    onClick={() => handleClickGpu(name)}
                    height="48px"
                    direction="column"
                  />
                ))}
              </ButtonGrid>

              {/* MIG 프로필 드롭다운 - MIG 타입에서 GPU 선택 후 표시 */}
              {gpuName && isMigType && (
                <MigProfileSelectDropdown
                  profiles={migProfileOptions}
                  value={migProfile}
                  onChange={handleSelectMigProfile}
                  isError={Boolean(errors.resource?.gpu?.detail?.mig)}
                  isLoading={isLoadingProfiles}
                />
              )}
            </GpuSelectContainer>
          )}
        </GpuSelectFormItem>
      </Form>
    </FormSectionContainer>
  );
}

const ButtonGrid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  gap: 4px;
`;

const GpuSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GpuSelectFormItem = styled(FormItem)<{ $isCompact: boolean }>`
  ${({ $isCompact }) =>
    $isCompact &&
    `
      && {
        margin-bottom: 0;
      }

      && .ant-form-item-control-input,
      && .ant-form-item-control-input-content {
        min-height: 0;
      }
    `}
`;

const GpuSelectLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const GpuListSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
`;
