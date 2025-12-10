import type { Metadata } from "next";

import { SourcecodeListMain } from "@/domain/sourcecode/components/sourcecode-list-main";

export const metadata: Metadata = {
  title: "Sourcecode Management",
};

export default function AdminSourcecodeManagementPage() {
  return <SourcecodeListMain />;
}
