import type { Metadata } from "next";

import SettingMain from "@/components/setting/setting-main";

export const metadata: Metadata = {
  title: "Setting",
};

export default function StandardSettingPage() {
  return <SettingMain />;
}
