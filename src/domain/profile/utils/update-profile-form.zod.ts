import { z } from "zod";

import { UPDATE_PROFILE_FORM_CONSTANTS } from "@/domain/profile/constants/update-profile-form.constant";
import { UPDATE_PROFILE_FORM_ERROR_MESSAGES } from "@/domain/profile/constants/update-profile-form-error-message";

/**
 * 비밀번호 정책 정규식
 * - 영문, 숫자, 특수문자(!@#$%^&()) 모두 포함
 * - 8~16자
 */
export const PASSWORD_REGEX =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&()]).{8,16}$/;

/**
 * 회원정보 수정 폼 스키마
 */
export const updateProfileSchema = z
  .object({
    firstName: z
      .string({
        required_error: UPDATE_PROFILE_FORM_ERROR_MESSAGES.firstName.required,
      })
      .min(1, {
        message: UPDATE_PROFILE_FORM_ERROR_MESSAGES.firstName.required,
      })
      .max(UPDATE_PROFILE_FORM_CONSTANTS.firstName.maxLength, {
        message: UPDATE_PROFILE_FORM_ERROR_MESSAGES.firstName.too_long,
      }),
    lastName: z
      .string({
        required_error: UPDATE_PROFILE_FORM_ERROR_MESSAGES.lastName.required,
      })
      .min(1, {
        message: UPDATE_PROFILE_FORM_ERROR_MESSAGES.lastName.required,
      })
      .max(UPDATE_PROFILE_FORM_CONSTANTS.lastName.maxLength, {
        message: UPDATE_PROFILE_FORM_ERROR_MESSAGES.lastName.too_long,
      }),
    newPassword: z
      .string()
      .regex(PASSWORD_REGEX, {
        message: UPDATE_PROFILE_FORM_ERROR_MESSAGES.newPassword.invalid_pattern,
      })
      .or(z.literal("")),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    {
      message: UPDATE_PROFILE_FORM_ERROR_MESSAGES.confirmPassword.mismatch,
      path: ["confirmPassword"],
    },
  );

export type UpdateProfileFormType = z.infer<typeof updateProfileSchema>;
