import type { Metadata } from "next";

import { SourcecodeDetailMain } from "@/domain/sourcecode/components/detail/sourcecode-detail-main";

export const metadata: Metadata = {
  title: "Source Code Detail",
};

export default function UserSourcecodeDetailPage() {
  return <SourcecodeDetailMain mode="user" />;
}
