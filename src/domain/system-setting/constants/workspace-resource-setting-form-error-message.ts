export const WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES = {
  gpu: {
    required: "GPU 개수를 입력해 주세요.",
    invalid_type: "GPU 개수는 숫자여야 합니다.",
    too_small: "GPU 개수는 0 이상이어야 합니다.",
    too_big: "GPU 개수가 클러스터 용량을 초과합니다.",
  },
  cpu: {
    required: "CPU Core 수를 입력해 주세요.",
    invalid_type: "CPU Core 수는 숫자여야 합니다.",
    too_small: "CPU Core 수는 1 이상이어야 합니다.",
    too_big: "CPU Core 수가 클러스터 용량을 초과합니다.",
  },
  memory: {
    required: "Memory 용량을 입력해 주세요.",
    invalid_type: "Memory 용량은 숫자여야 합니다.",
    too_small: "Memory 용량은 1 이상이어야 합니다.",
    too_big: "Memory 용량이 클러스터 용량을 초과합니다.",
  },
  workspaceCount: {
    required: "워크스페이스 최대 생성 개수를 입력해 주세요.",
    invalid_type: "워크스페이스 최대 생성 개수는 숫자여야 합니다.",
    too_small: "워크스페이스 최대 생성 개수는 1 이상이어야 합니다.",
  },
  migResources: {
    profile: {
      required: "MIG Profile을 선택해 주세요.",
    },
    count: {
      required: "개수를 입력해 주세요.",
      invalid_type: "개수는 숫자여야 합니다.",
      too_small: "개수는 1 이상이어야 합니다.",
      too_big: "개수가 해당 Profile의 최대 개수를 초과합니다.",
    },
    duplicate: "이미 추가된 MIG Profile입니다.",
    not_found: "클러스터에 존재하지 않는 MIG Profile이 포함되어 있습니다.",
  },
} as const;
