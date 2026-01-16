import type { Metadata } from "next";

import { VolumeListMain } from "@/domain/volume/components/list/volume-list-main";

export const metadata: Metadata = {
  title: "Volume Management",
};

export default function AdminVolumeManagementPage() {
  return <VolumeListMain />;
}
