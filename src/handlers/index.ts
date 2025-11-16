/**
 * MSW 핸들러 통합
 * 모든 도메인별 핸들러를 하나로 통합하여 export
 */

import { groupHandlers } from "./group.handler";
import { hubHandlers } from "./hub.handler";
import { monitoringHandlers } from "./monitoring.handler";
import { nodeHandlers } from "./node.handler";
import { notificationHandlers } from "./notification.handler";
import { privateRegistryHandlers } from "./private-registry.handler";
import { privateRegistryImageHandlers } from "./private-registry-image.handler";
import { requestImageHandlers } from "./request-image.handler";
import { sourcecodeHandlers } from "./sourcecode.handler";
import { userHandlers } from "./user.handler";
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
  ...userHandlers,
  ...groupHandlers,
  ...notificationHandlers,
  ...monitoringHandlers,
  ...privateRegistryHandlers,
  ...privateRegistryImageHandlers,
];
