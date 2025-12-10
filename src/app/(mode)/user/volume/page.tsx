import type { Metadata } from "next";

import { VolumeListMain } from "@/domain/volume/components/volume-list-main";

export const metadata: Metadata = {
  title: "Volume",
};

export default function UserVolumePage() {
  return <VolumeListMain />;
}
