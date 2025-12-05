import type { Metadata } from "next";

import { SystemSettingMain } from "@/domain/system-setting/components/system-setting-main";

export const metadata: Metadata = {
  title: "Setting",
};

export default function AdminSettingPage() {
  return <SystemSettingMain />;
}
