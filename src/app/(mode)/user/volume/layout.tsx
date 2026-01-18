"use client";

import type { PropsWithChildren } from "react";

import { VolumeLayout } from "@/domain/volume/components/volume-layout";

export default function UserVolumeLayout({ children }: PropsWithChildren) {
  return <VolumeLayout mode="user">{children}</VolumeLayout>;
}
