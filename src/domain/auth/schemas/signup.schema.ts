import { z } from "zod";

/**
 * 비밀번호 정책 정규식
 * - 영문 대소문자, 숫자, 특수문자 중 2가지 이상 조합
 * - 8~16자
 *
 * 조합 조건:
 * - 영문 + 숫자
 * - 영문 + 특수문자
 * - 숫자 + 특수문자
 * - 3가지 모두
 */
const passwordRegex =
  /^(?:(?=.*[a-zA-Z])(?=.*\d)|(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])|(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])).{8,16}$/;

/**
 * 회원가입 폼 스키마
 *
 * 유효성 검증 규칙:
 * - Email: 필수, 이메일 형식
 * - Password: 필수, 영문/숫자/특수문자 중 2가지 이상 조합 8~16자
 * - Confirm Password: 필수, Password와 일치
 * - First Name: 필수, 최대 25자
 * - Last Name: 필수, 최대 25자
 */
export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해 주세요.")
      .email("올바른 이메일 형식을 입력해 주세요."),
    password: z
      .string()
      .min(1, "비밀번호를 입력해 주세요.")
      .regex(
        passwordRegex,
        "영문 대소문자, 숫자, 특수문자 중 2가지 이상, 8~16자 이내로 입력해 주세요.",
      ),
    confirmPassword: z.string().min(1, "비밀번호를 한 번 더 입력해 주세요."),
    firstName: z
      .string()
      .min(1, "이름을 입력해 주세요.")
      .max(25, "이름은 25자 이내로 입력해 주세요."),
    lastName: z
      .string()
      .min(1, "성을 입력해 주세요.")
      .max(25, "성은 25자 이내로 입력해 주세요."),
    groupName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

/**
 * 회원가입 폼 타입
 */
export type SignupFormType = z.infer<typeof signupSchema>;
