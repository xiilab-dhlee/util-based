import type { Metadata } from "next";

import { WorkspaceListMain } from "@/components/workspace/list/workspace-list-main";

export const metadata: Metadata = {
  title: "Workspace Management",
};

export default function AdminWorkspacePage() {
  return <WorkspaceListMain />;
}
