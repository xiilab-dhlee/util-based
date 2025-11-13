import type { GetNodesPayload } from "@/types/node/node.interface";

const nodeKeys = {
  default: ["node"],
  list: (payload: GetNodesPayload) => [
    ...nodeKeys.default,
    "list",
    ...Object.values(payload),
  ],
  detail: (nodeName: string) => [...nodeKeys.default, "detail", nodeName],
  resources: (nodeName: string) => [...nodeKeys.default, "resources", nodeName],
  mpsInfo: (nodeName: string) => [...nodeKeys.default, "mpsInfo", nodeName],
  migInfo: (nodeName: string) => [...nodeKeys.default, "migInfo", nodeName],
  bmcInfo: (nodeIp: string) => [...nodeKeys.default, "bmcInfo", nodeIp],
};

export default nodeKeys;
