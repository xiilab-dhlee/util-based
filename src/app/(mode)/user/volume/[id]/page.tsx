import type { Metadata } from "next";

import { VolumeDetailMain } from "@/domain/volume/components/detail/volume-detail-main";

export const metadata: Metadata = {
  title: "Volume Detail",
};

export default function UserVolumeDetailPage() {
  return <VolumeDetailMain />;
}
