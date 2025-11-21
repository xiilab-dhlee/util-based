import type { Metadata } from "next";

import { SettingMain } from "@/domain/setting/components/setting-main";

export const metadata: Metadata = {
  title: "Setting",
};

export default function StandardSettingPage() {
  return <SettingMain />;
}
