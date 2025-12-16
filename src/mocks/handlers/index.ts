/**
 * MSW 핸들러 통합
 * 모든 도메인별 핸들러를 하나로 통합하여 export
 */

import { resourcePresetHandlers } from "@/domain/resource-preset/mocks/resource-preset.handler";
import { fileSecurityHandlers } from "@/domain/security/mocks/file-security.handler";
import { registrySecurityHandlers } from "@/domain/security/mocks/registry-security.handler";
import { accountHandlers } from "@/mocks/handlers/account.handler";
import { credentialHandlers } from "@/mocks/handlers/credential.handler";
import { gpuHandlers } from "@/mocks/handlers/gpu.handler";
import { groupHandlers } from "@/mocks/handlers/group.handler";
import { hpeHandlers } from "@/mocks/handlers/hpe.handler";
import { hubHandlers } from "@/mocks/handlers/hub.handler";
import { internalregistryHandlers } from "@/mocks/handlers/internal-registry.handler";
import { internalregistryImageHandlers } from "@/mocks/handlers/internal-registry-image.handler";
import { kubernetesMonitoringHandlers } from "@/mocks/handlers/kubernetes-monitoring.handler";
import { licenseHandlers } from "@/mocks/handlers/license.handler";
import { monitoringHandlers } from "@/mocks/handlers/monitoring.handler";
import { nodeHandlers } from "@/mocks/handlers/node.handler";
import { notificationHandlers } from "@/mocks/handlers/notification.handler";
import { redfishHandlers } from "@/mocks/handlers/redfish.handler";
import { reportHandlers } from "@/mocks/handlers/report.handler";
import { reportReservationHandlers } from "@/mocks/handlers/report-reservation.handler";
import { requestImageHandlers } from "@/mocks/handlers/request-image.handler";
import { revokeHistoryHandlers } from "@/mocks/handlers/revoke-history.handler";
import { smtpHandlers } from "@/mocks/handlers/smtp.handler";
import { sourcecodeHandlers } from "@/mocks/handlers/sourcecode.handler";
import { storageSettingHandlers } from "@/mocks/handlers/storage-setting.handler";
import { systemMonitoringHandlers } from "@/mocks/handlers/system-monitoring.handler";
import { volumeHandlers } from "@/mocks/handlers/volume.handler";
import { workloadHandlers } from "@/mocks/handlers/workload.handler";
import { workspaceHandlers } from "@/mocks/handlers/workspace.handler";
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
  ...fileSecurityHandlers,
  ...registrySecurityHandlers,
  ...revokeHistoryHandlers,
  ...storageSettingHandlers,
  ...systemMonitoringHandlers,
  ...hpeHandlers,
  ...licenseHandlers,
  ...smtpHandlers,
  ...reportHandlers,
  ...reportReservationHandlers,
  ...resourcePresetHandlers,
];
