/**
 * MSW 핸들러 통합
 * 모든 도메인별 핸들러를 하나로 통합하여 export
 */

import { accountHandlers } from "./account.handler";
import { credentialHandlers } from "./credential.handler";
import { gpuHandlers } from "./gpu.handler";
import { groupHandlers } from "./group.handler";
import { hubHandlers } from "./hub.handler";
import { internalregistryHandlers } from "./internal-registry.handler";
import { internalregistryImageHandlers } from "./internal-registry-image.handler";
import { kubernetesMonitoringHandlers } from "./kubernetes-monitoring.handler";
import { monitoringHandlers } from "./monitoring.handler";
import { nodeHandlers } from "./node.handler";
import { notificationHandlers } from "./notification.handler";
import { redfishHandlers } from "./redfish.handler";
import { requestImageHandlers } from "./request-image.handler";
import { sourcecodeHandlers } from "./sourcecode.handler";
import { volumeHandlers } from "./volume.handler";
import { workloadHandlers } from "./workload.handler";
import { workspaceHandlers } from "./workspace.handler";

/**
 * 기본 핸들러 (모든 도메인)
 */

export const combinedHandlers = [
  ...workloadHandlers,
  ...sourcecodeHandlers,
  ...volumeHandlers,
  ...hubHandlers,
  ...workspaceHandlers,
  ...requestImageHandlers,
  ...nodeHandlers,
  ...redfishHandlers,
  ...accountHandlers,
  ...groupHandlers,
  ...notificationHandlers,
  ...monitoringHandlers,
  ...internalregistryHandlers,
  ...internalregistryImageHandlers,
  ...kubernetesMonitoringHandlers,
  ...credentialHandlers,
  ...gpuHandlers,
];
