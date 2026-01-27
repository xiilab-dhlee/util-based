"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import {
  GetGpuResourceCapacityGpuType,
  GpuResponseGpuType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  useGetClusterTotalResources,
  useGetGpuResourceCapacity,
} from "@/api/generated/cluster-resource/cluster-resource";
import type { CreatePresetBodyExtended } from "@/domain/resource-preset/utils/create-resource-preset-form.override.zod";
import { Slider } from "@/shared/components/slider";
import { convertBytes, convertToBytes } from "@/shared/utils/resource.util";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import {
  FormSectionContainer,
  FormSectionHeader,
} from "@/styles/layers/form-layer.styled";
import { errorTextStyle } from "@/styles/mixins/text";

interface CreateResourcePresetResourceInfoProps {
  isNormalGpuListEnabled: boolean;
}

export function CreateResourcePresetResourceInfo({
  isNormalGpuListEnabled,
}: CreateResourcePresetResourceInfoProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreatePresetBodyExtended>();

  // 폼 값 구독
  const gpu = useWatch({ control, name: "resource.gpu" });
  const gpuType = useWatch({ control, name: "resource.gpu.gpuType" });
  const gpuName = useWatch({ control, name: "resource.gpu.gpuName" });
  const migProfile = useWatch({
    control,
    name: "resource.gpu.detail.mig.0.profile",
  });

  const isGpuUnused = gpu === null;

  const isUsingClusterTotal =
    !isNormalGpuListEnabled &&
    (isGpuUnused || gpuType === GpuResponseGpuType.NORMAL);

  const isCapacityQueryEnabled =
    !isGpuUnused &&
    !isUsingClusterTotal &&
    Boolean(gpuName) &&
    (gpuType === GpuResponseGpuType.MIG
      ? Boolean(migProfile)
      : Boolean(gpuType));

  // GPU 타입을 API 파라미터로 변환
  const capacityGpuType =
    gpuType === GpuResponseGpuType.MIG
      ? GetGpuResourceCapacityGpuType.MIG
      : GetGpuResourceCapacityGpuType.NORMAL;

  // 리소스 Capacity 조회 (GPU 선택 시에만)
  const { data: capacityData } = useGetGpuResourceCapacity(
    {
      gpuType: capacityGpuType,
      gpuName: gpuName ?? "",
      profile: gpuType === GpuResponseGpuType.MIG ? migProfile : undefined,
    },
    { query: { enabled: isCapacityQueryEnabled } },
  );

  const { data: clusterTotalData } = useGetClusterTotalResources({
    query: { enabled: isUsingClusterTotal },
  });

  const maxGpu = isUsingClusterTotal
    ? (clusterTotalData?.gpu?.clusterCapacityCount ?? 0)
    : (capacityData?.gpuCapacity ?? 0);
  const maxCpu = isUsingClusterTotal
    ? (clusterTotalData?.cpu?.clusterCapacityCores ?? 0)
    : (capacityData?.cpuCapacity ?? 0);
  const maxMemoryBytes = isUsingClusterTotal
    ? Number(clusterTotalData?.memory?.clusterCapacityBytes ?? 0)
    : (capacityData?.memCapacity ?? 0);

  // 메모리 bytes → GB 변환
  const { value: maxMemoryGB } = convertBytes(maxMemoryBytes, "GB");

  // GPU 슬라이더 표시 조건
  const showNormalGpuSlider =
    gpuType === GpuResponseGpuType.NORMAL || isGpuUnused;
  const showMigGpuSlider = gpuType === GpuResponseGpuType.MIG;

  const isResourceDisabled = isUsingClusterTotal ? false : !gpuName;
  const isMigGpuDisabled = isGpuUnused ? true : !gpuName || !migProfile;
  const isNormalGpuDisabled = isGpuUnused ? true : isResourceDisabled;
  const gpuCountErrorMessage =
    errors.resource?.gpu?.detail?.normal?.requestCount?.message ??
    errors.resource?.gpu?.detail?.mig?.[0]?.requestCount?.message ??
    errors.resource?.gpu?.detail?.mps?.requestCount?.message;

  return (
    <FormSectionContainer>
      <FormSectionHeader>
        <CreateWorkloadSectionTitle className="required">
          리소스 정보
        </CreateWorkloadSectionTitle>
      </FormSectionHeader>
      <SliderContainer>
        {/* GPU 슬라이더 (NORMAL 타입, 0 가능) */}
        {showNormalGpuSlider && (
          <SliderRow>
            <SliderLabel>
              <Typography.Text variant="body-2-3" color="#484848">
                GPU
              </Typography.Text>
            </SliderLabel>
            <SliderWrapper>
              <Controller
                control={control}
                name="resource.gpu.detail.normal.requestCount"
                render={({ field }) => (
                  <Slider
                    min={0}
                    max={maxGpu}
                    value={field.value ?? 0}
                    onChange={field.onChange}
                    type="GPU"
                    width="100%"
                    disabled={isNormalGpuDisabled}
                  />
                )}
              />
            </SliderWrapper>
          </SliderRow>
        )}

        {/* GPU 슬라이더 (MIG 타입, 0 가능) */}
        {showMigGpuSlider && (
          <SliderRow>
            <SliderLabel>
              <Typography.Text variant="body-2-3" color="#484848">
                GPU
              </Typography.Text>
            </SliderLabel>
            <SliderWrapper>
              <Controller
                control={control}
                name="resource.gpu.detail.mig.0.requestCount"
                render={({ field }) => (
                  <Slider
                    min={0}
                    max={maxGpu}
                    value={field.value ?? 0}
                    onChange={field.onChange}
                    type="GPU"
                    width="100%"
                    disabled={isMigGpuDisabled}
                  />
                )}
              />
            </SliderWrapper>
          </SliderRow>
        )}

        {/* CPU 슬라이더 (0 가능) */}
        <SliderRow>
          <SliderLabel>
            <Typography.Text variant="body-2-3" color="#484848">
              CPU
            </Typography.Text>
          </SliderLabel>
          <SliderWrapper>
            <Controller
              control={control}
              name="resource.cpu.requestCore"
              render={({ field }) => (
                <Slider
                  min={0}
                  max={maxCpu}
                  value={field.value}
                  onChange={field.onChange}
                  type="CPU"
                  width="100%"
                  disabled={false}
                />
              )}
            />
          </SliderWrapper>
        </SliderRow>

        {/* Memory 슬라이더 (GB 단위로 표시, bytes로 저장, 0 가능) */}
        <SliderRow>
          <SliderLabel>
            <Typography.Text variant="body-2-3" color="#484848">
              Memory
            </Typography.Text>
          </SliderLabel>
          <SliderWrapper>
            <Controller
              control={control}
              name="resource.memory.requestByte"
              render={({ field }) => {
                const currentGB = convertBytes(field.value, "GB").value;
                return (
                  <Slider
                    min={0}
                    max={maxMemoryGB}
                    value={currentGB}
                    onChange={(gb) => field.onChange(convertToBytes(gb, "GB"))}
                    type="MEM"
                    width="100%"
                    disabled={false}
                  />
                );
              }}
            />
          </SliderWrapper>
        </SliderRow>
      </SliderContainer>
      {errors.resource?.message && (
        <ErrorMessage>{errors.resource.message}</ErrorMessage>
      )}
      {gpuCountErrorMessage && (
        <ErrorMessage>{gpuCountErrorMessage}</ErrorMessage>
      )}
    </FormSectionContainer>
  );
}

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: #fafafa;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SliderLabel = styled.div`
  width: 50px;
  flex-shrink: 0;
`;

const SliderWrapper = styled.div`
  flex: 1;
`;

const ErrorMessage = styled.span`
  margin-top: 4px;
  ${errorTextStyle};
`;
