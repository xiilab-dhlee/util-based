import type { Metadata } from "next";

import { RequestResourceMain } from "@/domain/request-resource/components/request-resource-main";

export const metadata: Metadata = {
  title: "Workspace Management",
};

export default function AdminWorkspaceRequestResourcePage() {
  return <RequestResourceMain />;
}
