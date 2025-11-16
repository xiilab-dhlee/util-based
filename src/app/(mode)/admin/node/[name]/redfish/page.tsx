import type { Metadata } from "next";

import { NodeRedfishMain } from "@/components/node/redfish/node-redfish-main";

export const metadata: Metadata = {
  title: "Node Management",
};

export default function AdminNodeRedfishPage() {
  return <NodeRedfishMain />;
}
