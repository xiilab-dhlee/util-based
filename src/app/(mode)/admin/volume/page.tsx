import type { Metadata } from "next";

import { VolumeListMain } from "@/domain/volume/components/list/volume-list-main";

export const metadata: Metadata = {
  title: "Volume",
};

export default function AdminVolumePage() {
  return <VolumeListMain />;
}
