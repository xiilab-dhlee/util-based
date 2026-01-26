"use client";

import type { PropsWithChildren } from "react";

import { SourcecodeLayout } from "@/domain/sourcecode/components/sourcecode-layout";

export default function AdminSourcecodeLayout({ children }: PropsWithChildren) {
  return <SourcecodeLayout mode="admin">{children}</SourcecodeLayout>;
}
