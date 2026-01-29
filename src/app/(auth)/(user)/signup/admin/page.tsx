import type { Metadata } from "next";

import { SignupMain } from "@/domain/auth/components/signup/signup-main";

export const metadata: Metadata = {
  title: "관리자 회원가입",
};

/**
 * 관리자 회원가입 페이지
 */
export default function AdminSignupPage() {
  return <SignupMain mode="SUPER_ADMIN" />;
}
