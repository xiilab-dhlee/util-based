import type { Metadata } from "next";

import { LicenseMain } from "@/domain/auth/components/license/license-main";

export const metadata: Metadata = {
  title: "License",
};

/**
 * 라이선스 등록 페이지
 */
export default function LicensePage() {
  return <LicenseMain />;
}
