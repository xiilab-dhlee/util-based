"use client";

import type { PropsWithChildren } from "react";

import { VolumeLayout } from "@/domain/volume/components/volume-layout";

export default function AdminVolumeLayout({ children }: PropsWithChildren) {
  return <VolumeLayout mode="admin">{children}</VolumeLayout>;
}
