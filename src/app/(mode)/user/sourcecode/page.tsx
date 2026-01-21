import type { Metadata } from "next";

import { SourcecodeListMain } from "@/domain/sourcecode/components/list/sourcecode-list-main";

export const metadata: Metadata = {
  title: "Source Code",
};

export default function UserSourcecodePage() {
  return <SourcecodeListMain />;
}
