"use client";

import { Form, FormItem, Input, TextArea } from "xiilab-ui";

import { useResourcePresetForm } from "@/domain/resource-preset/hooks/use-resource-preset-form";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import {
  FormSectionContainer,
  FormSectionHeader,
} from "@/styles/layers/form-layer.styled";

export function CreateResourcePresetBasicInfo() {
  const { form, errors, setField } = useResourcePresetForm();

  return (
    <FormSectionContainer>
      <FormSectionHeader>
        <CreateWorkloadSectionTitle>기본 정보</CreateWorkloadSectionTitle>
      </FormSectionHeader>
      <Form layout="vertical">
        <FormItem
          label="리소스 프리셋 이름"
          required
          validateStatus={errors.name ? "error" : undefined}
        >
          <Input
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="리소스 프리셋 이름을 입력해 주세요."
            status={errors.name ? "error" : undefined}
            width="100%"
          />
        </FormItem>

        <FormItem label="설명">
          <TextArea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="리소스 프리셋 설명을 입력해 주세요."
            width="100%"
            height="100px"
            resize="none"
          />
        </FormItem>
      </Form>
    </FormSectionContainer>
  );
}
