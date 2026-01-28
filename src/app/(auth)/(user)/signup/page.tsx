import type { Metadata } from "next";

import { SignupMain } from "@/domain/auth/components/signup/signup-main";

export const metadata: Metadata = {
  title: "Sign up",
};

/**
 * 회원가입 페이지
 */
export default function SignupPage() {
  return <SignupMain mode="USER" />;
}
