import type { Metadata } from "next";

import { WorkspaceRequestResourceMain } from "@/components/workspace/request-resource/workspace-request-resource-main";

export const metadata: Metadata = {
  title: "Workspace Management",
};

export default function AdminWorkspaceRequestResourcePage() {
  return <WorkspaceRequestResourceMain />;
}
