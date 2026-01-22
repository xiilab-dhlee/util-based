import { UPDATE_PROFILE_FORM_CONSTANTS } from "./update-profile-form.constant";

const { firstName, lastName, password } = UPDATE_PROFILE_FORM_CONSTANTS;

export const UPDATE_PROFILE_FORM_ERROR_MESSAGES = {
  firstName: {
    required: "이름을 입력해 주세요.",
    too_long: `이름은 ${firstName.maxLength}자 이내로 입력해 주세요.`,
  },
  lastName: {
    required: "성을 입력해 주세요.",
    too_long: `성은 ${lastName.maxLength}자 이내로 입력해 주세요.`,
  },
  newPassword: {
    invalid_pattern: `비밀번호는 영문, 숫자, 특수문자(!@#$%^&()) 포함 ${password.minLength}~${password.maxLength}자 이내로 입력해 주세요.`,
  },
  confirmPassword: {
    mismatch: "비밀번호가 일치하지 않습니다.",
  },
} as const;
