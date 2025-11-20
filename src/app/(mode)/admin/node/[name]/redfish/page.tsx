import type { Metadata } from "next";

import { NodeRedfishMain } from "@/domain/node/components/redfish/node-redfish-main";

export const metadata: Metadata = {
  title: "Node Management",
};

export default function AdminNodeRedfishPage() {
  return <NodeRedfishMain />;
}
