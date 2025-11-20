/**
 * MSW 핸들러 통합
 * 모든 도메인별 핸들러를 하나로 통합하여 export
 */

import { credentialHandlers } from "../mocks/handlers/credential.handler";
import { groupHandlers } from "../mocks/handlers/group.handler";
import { hubHandlers } from "../mocks/handlers/hub.handler";
import { monitoringHandlers } from "../mocks/handlers/monitoring.handler";
import { nodeHandlers } from "../mocks/handlers/node.handler";
import { notificationHandlers } from "../mocks/handlers/notification.handler";
import { privateRegistryHandlers } from "../mocks/handlers/private-registry.handler";
import { privateRegistryImageHandlers } from "../mocks/handlers/private-registry-image.handler";
import { redfishHandlers } from "../mocks/handlers/redfish.handler";
import { requestImageHandlers } from "../mocks/handlers/request-image.handler";
import { sourcecodeHandlers } from "../mocks/handlers/sourcecode.handler";
import { userHandlers } from "../mocks/handlers/user.handler";
import { volumeHandlers } from "../mocks/handlers/volume.handler";
import { workloadHandlers } from "../mocks/handlers/workload.handler";
import { workspaceHandlers } from "../mocks/handlers/workspace.handler";

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
  ...userHandlers,
  ...groupHandlers,
  ...notificationHandlers,
  ...monitoringHandlers,
  ...privateRegistryHandlers,
  ...privateRegistryImageHandlers,
  ...credentialHandlers,
];
