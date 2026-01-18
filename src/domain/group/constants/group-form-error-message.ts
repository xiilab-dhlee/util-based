import {
  GROUP_DESCRIPTION_MAX_LENGTH,
  GROUP_NAME_MAX_LENGTH,
} from "@/domain/group/constants/group-validation.constant";

export const GROUP_FORM_ERROR_MESSAGES = {
  groupName: {
    required: "그룹 이름을 입력해 주세요.",
    invalid_type: "그룹 이름 값이 올바르지 않습니다.",
    invalid_pattern:
      "그룹 이름은 한글/영문/숫자/-, _, ., 공백만 사용할 수 있습니다.",
    too_long: `그룹 이름은 ${GROUP_NAME_MAX_LENGTH}자 이하여야 합니다.`,
  },
  description: {
    invalid_type: "그룹 설명 값이 올바르지 않습니다.",
    too_long: `그룹 설명은 ${GROUP_DESCRIPTION_MAX_LENGTH}자 이하여야 합니다.`,
  },
  parentGroupId: {
    invalid_type: "상위 그룹 값이 올바르지 않습니다.",
  },
  accountId: {
    invalid_type: "멤버 목록 값이 올바르지 않습니다.",
  },
} as const;
