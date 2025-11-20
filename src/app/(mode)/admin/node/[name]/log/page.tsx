import type { Metadata } from "next";

import { NodeLogMain } from "@/domain/node/components/log/node-log-main";

export const metadata: Metadata = {
  title: "Node Management",
};

export default function AdminNodeLogPage() {
  return <NodeLogMain />;
}
