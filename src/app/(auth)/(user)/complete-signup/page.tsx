import type { Metadata } from "next";

import { CompleteSignupMain } from "@/domain/auth/components/signup/complete-signup-main";

export const metadata: Metadata = {
  title: "Complete signup",
};

/**
 * 회원가입 완료 페이지
 */
export default function CompleteSignupPage() {
  return <CompleteSignupMain />;
}
