import { z } from "zod";

/**
 * 회원가입 폼 스키마
 */
export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해 주세요.")
      .email("올바른 이메일 형식을 입력해 주세요."),
    password: z.string().min(1, "비밀번호를 입력해 주세요."),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해 주세요."),
    firstName: z.string().min(1, "이름을 입력해 주세요."),
    lastName: z.string().min(1, "성을 입력해 주세요."),
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
