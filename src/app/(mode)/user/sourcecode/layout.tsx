"use client";

import type { PropsWithChildren } from "react";

import { SourcecodeLayout } from "@/domain/sourcecode/components/sourcecode-layout";

export default function UserSourcecodeLayout({ children }: PropsWithChildren) {
  return <SourcecodeLayout mode="user">{children}</SourcecodeLayout>;
}
