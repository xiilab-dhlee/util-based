import type { Metadata } from "next";

import { NodeLogMain } from "@/components/node/log/node-log-main";

export const metadata: Metadata = {
  title: "Node Management",
};

export default function AdminNodeLogPage() {
  return <NodeLogMain />;
}
