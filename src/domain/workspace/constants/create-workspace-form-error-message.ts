export const CREATE_WORKSPACE_ERROR_MESSAGES = {
  workspaceName: {
    required: "워크스페이스 이름을 입력해 주세요.",
    too_long: "워크스페이스 이름은 최대 50자까지 입력할 수 있습니다.",
    invalid_pattern:
      "워크스페이스 이름은 한글, 영문, 숫자, -, _ 만 사용할 수 있습니다.",
  },
  description: {
    too_long: "워크스페이스 설명은 최대 1000자까지 입력할 수 있습니다.",
  },
} as const;

export type CreateWorkspaceErrorMessages =
  typeof CREATE_WORKSPACE_ERROR_MESSAGES;
