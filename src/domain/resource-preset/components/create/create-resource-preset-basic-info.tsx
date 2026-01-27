"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Form, FormItem, Input, TextArea } from "xiilab-ui";

import { CREATE_RESOURCE_PRESET_FORM_CONSTANTS } from "@/domain/resource-preset/constants/create-resource-preset-form.constant";
import type { CreatePresetBodyExtended } from "@/domain/resource-preset/utils/create-resource-preset-form.override.zod";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import {
  FormSectionContainer,
  FormSectionHeader,
} from "@/styles/layers/form-layer.styled";

export function CreateResourcePresetBasicInfo() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreatePresetBodyExtended>();

  return (
    <FormSectionContainer>
      <FormSectionHeader>
        <CreateWorkloadSectionTitle>기본 정보</CreateWorkloadSectionTitle>
      </FormSectionHeader>
      <Form layout="vertical">
        <FormItem
          label="리소스 프리셋 이름"
          required
          validateStatus={errors.presetName ? "error" : undefined}
          help={errors.presetName?.message}
        >
          <Controller
            control={control}
            name="presetName"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="리소스 프리셋 이름을 입력해 주세요."
                status={errors.presetName ? "error" : undefined}
                maxLength={
                  CREATE_RESOURCE_PRESET_FORM_CONSTANTS.presetName.maxLength
                }
                width="100%"
              />
            )}
          />
        </FormItem>

        <FormItem
          label="설명"
          validateStatus={errors.description ? "error" : undefined}
          help={errors.description?.message}
        >
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextArea
                {...field}
                value={field.value ?? ""}
                placeholder="리소스 프리셋 설명을 입력해 주세요."
                maxLength={
                  CREATE_RESOURCE_PRESET_FORM_CONSTANTS.description.maxLength
                }
                width="100%"
                height="100px"
                resize="none"
              />
            )}
          />
        </FormItem>
      </Form>
    </FormSectionContainer>
  );
}
