import type { Metadata } from "next";

import { SourcecodeDetailMain } from "@/domain/sourcecode/components/detail/sourcecode-detail-main";

export const metadata: Metadata = {
  title: "Sourcecode Detail",
};

export default function AdminSourcecodeDetailPage() {
  return <SourcecodeDetailMain mode="admin" />;
}
