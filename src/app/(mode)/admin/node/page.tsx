import type { Metadata } from "next";

import { NodeListMain } from "@/domain/node/components/list/node-list-main";

export const metadata: Metadata = {
  title: "Node Management",
};

export default function AdminNodePage() {
  return <NodeListMain />;
}
