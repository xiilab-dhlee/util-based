import type { Metadata } from "next";

import { RequestResourceMain } from "@/components/request-resource/request-resource-main";

export const metadata: Metadata = {
  title: "Workspace Management",
};

export default function AdminWorkspaceRequestResourcePage() {
  return <RequestResourceMain />;
}
