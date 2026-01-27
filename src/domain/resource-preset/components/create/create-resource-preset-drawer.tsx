"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import { Button, Drawer, Typography } from "xiilab-ui";

import type { ResourcePresetCreateRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { GpuResponseGpuType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { CreateResourcePresetBasicInfo } from "@/domain/resource-preset/components/create/create-resource-preset-basic-info";
import { CreateResourcePresetGpuInfo } from "@/domain/resource-preset/components/create/create-resource-preset-gpu-info";
import { CreateResourcePresetJobType } from "@/domain/resource-preset/components/create/create-resource-preset-job-type";
import { CreateResourcePresetResourceInfo } from "@/domain/resource-preset/components/create/create-resource-preset-resource-info";
import { CREATE_RESOURCE_PRESET_FORM_DEFAULT_VALUES } from "@/domain/resource-preset/constants/create-resource-preset-form.constant";
import { CREATE_RESOURCE_PRESET_FORM_ERROR_MESSAGES } from "@/domain/resource-preset/constants/create-resource-preset-form-error-message";
import { useCreatePresetAction } from "@/domain/resource-preset/hooks/preset-action";
import { openCreateResourcePresetDrawerAtom } from "@/domain/resource-preset/state/resource-preset-form.atom";
import {
  type CreatePresetBodyExtended,
  createPresetBodyExtended,
} from "@/domain/resource-preset/utils/create-resource-preset-form.override.zod";
import { hideScrollbar } from "@/styles/mixins/scrollbar";

export function CreateResourcePresetDrawer() {
  const [open, setOpen] = useAtom(openCreateResourcePresetDrawerAtom);
  const [isNormalGpuListEnabled, setIsNormalGpuListEnabled] = useState(false);

  const methods = useForm<CreatePresetBodyExtended>({
    resolver: zodResolver(createPresetBodyExtended),
    defaultValues: CREATE_RESOURCE_PRESET_FORM_DEFAULT_VALUES,
  });

  const createPreset = useCreatePresetAction();

  const handleClose = () => {
    setOpen(false);
    methods.reset();
  };

  const buildCreatePresetPayload = (
    data: CreatePresetBodyExtended,
  ): ResourcePresetCreateRequest => {
    return {
      ...data,
      resource: {
        ...data.resource,
        gpu: data.resource.gpu ?? undefined,
      },
    };
  };

  const handleSubmitForm = (data: CreatePresetBodyExtended) => {
    const payload = buildCreatePresetPayload(data);

    createPreset.mutate(
      { data: payload },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  const handleInvalid = () => {
    const gpu = methods.getValues("resource.gpu");
    const shouldRequireGpuName =
      Boolean(gpu) &&
      gpu?.gpuType === GpuResponseGpuType.NORMAL &&
      isNormalGpuListEnabled;

    if (shouldRequireGpuName && !gpu?.gpuName) {
      methods.setError("resource.gpu.gpuName", {
        type: "manual",
        message:
          CREATE_RESOURCE_PRESET_FORM_ERROR_MESSAGES.resource.gpu.gpuName
            .required,
      });
    }
  };

  const handleSubmit = methods.handleSubmit(handleSubmitForm, handleInvalid);

  return (
    <FormProvider {...methods}>
      <Drawer
        open={open}
        onClose={handleClose}
        placement="right"
        width={620}
        title="리소스 프리셋 생성"
        footer={
          <Footer>
            <CancelButton>
              <Button
                variant="outlined"
                size="medium"
                onClick={handleClose}
                width="100%"
              >
                <Typography.Text variant="button-1">취소</Typography.Text>
              </Button>
            </CancelButton>
            <ActionButton>
              <Button
                color="primary"
                variant="gradient"
                size="medium"
                onClick={handleSubmit}
                iconPosition="left"
                icon="Plus"
                iconSize={24}
                width="100%"
                loading={createPreset.isPending}
              >
                리소스 프리셋 생성
              </Button>
            </ActionButton>
          </Footer>
        }
        closable={true}
        maskClosable={true}
      >
        <Container>
          <Body>
            {/* 기본 정보 */}
            <CreateResourcePresetBasicInfo />
            {/* Job Type */}
            <CreateResourcePresetJobType />
            {/* GPU 정보 */}
            <CreateResourcePresetGpuInfo
              isNormalGpuListEnabled={isNormalGpuListEnabled}
              onChangeNormalGpuListEnabled={setIsNormalGpuListEnabled}
            />
            {/* 리소스 정보 */}
            <CreateResourcePresetResourceInfo
              isNormalGpuListEnabled={isNormalGpuListEnabled}
            />
          </Body>
        </Container>
      </Drawer>
    </FormProvider>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding-top: 20px;
  padding-bottom: 20px;

  ${hideScrollbar}
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const CancelButton = styled.div`
  width: 20%;
`;

const ActionButton = styled.div`
  width: 80%;
`;
