import type { Metadata } from "next";

import { VolumeListMain } from "@/components/volume/list/volume-list-main";

/**
 * 표준 사용자 볼륨 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "볼륨",
};
/**
 * 표준 사용자 볼륨 페이지
 *
 */
export default function StandardVolumePage() {
  return <VolumeListMain />;
}
