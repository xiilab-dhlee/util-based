import { CREATE_RESOURCE_PRESET_FORM_CONSTANTS } from "./create-resource-preset-form.constant";

const { presetName, description } = CREATE_RESOURCE_PRESET_FORM_CONSTANTS;

export const CREATE_RESOURCE_PRESET_FORM_ERROR_MESSAGES = {
  presetName: {
    required: "리소스 프리셋 이름을 입력해 주세요.",
    too_long: `리소스 프리셋 이름은 ${presetName.maxLength}자 이내로 입력해 주세요.`,
  },
  description: {
    too_long: `설명은 ${description.maxLength}자 이내로 입력해 주세요.`,
  },
  resource: {
    at_least_one: "CPU, Memory, GPU 중 최소 1개는 입력해야 합니다.",
    gpu: {
      gpuName: {
        required: "GPU를 선택해 주세요.",
      },
      detail: {
        mig_profile: "MIG 프로필을 선택해 주세요.",
        normal_count: "GPU 수량을 입력해 주세요.",
        mig_count: "GPU 수량을 입력해 주세요.",
        mps_count: "GPU 수량을 입력해 주세요.",
      },
    },
  },
} as const;
