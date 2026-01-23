/**
 * MSW 핸들러 통합
 * 모든 도메인별 핸들러를 하나로 통합하여 export
 *
 * Lazy Mock 모드:
 * - MOCK_DELAY 환경변수 설정 시 모든 API 응답에 지연 적용
 * - 예: MOCK_DELAY=5000 pnpm dev
 */

import { delay, type HttpHandler } from "msw";

import { getAccountProfileMock } from "@/api/generated/account-profile/account-profile.msw";
import { getAdminK8sMock } from "@/api/generated/admin-k8s/admin-k8s.msw";
import { getAdminMonitoringNotificationMock } from "@/api/generated/admin-monitoring-notification/admin-monitoring-notification.msw";
import { getAdminQueueMock } from "@/api/generated/admin-queue/admin-queue.msw";
import { getAdminWorkloadMock } from "@/api/generated/admin-workload/admin-workload.msw";
import { getWorkspaceMemberMock } from "@/api/generated/workspace-member/workspace-member.msw";
import { accountManagementHandlers } from "@/domain/account-management/mocks";
import { authHandlers } from "@/domain/auth/mocks";
import { credentialHandlers } from "@/domain/credential/mocks";
import { groupHandlers } from "@/domain/group/mocks";
import { notificationHandlers } from "@/domain/notification/mocks";
import { registryHandlers } from "@/domain/registry/mocks";
import { resourcePresetHandlers } from "@/domain/resource-preset/mocks/resource-preset.handler";
import { fileSecurityHandlers } from "@/domain/security/mocks/file-security.handler";
import { registrySecurityHandlers } from "@/domain/security/mocks/registry-security.handler";
import { storageHandlers } from "@/domain/storage/mocks";
import { systemSettingHandlers } from "@/domain/system-setting/mocks";
import { volumeHandlers } from "@/domain/volume/mocks";
import { workspaceHandlers } from "@/domain/workspace/mocks";
import { gpuHandlers } from "@/mocks/handlers/gpu.handler";
import { hpeHandlers } from "@/mocks/handlers/hpe.handler";
import { hubHandlers } from "@/mocks/handlers/hub.handler";
import { monitoringHandlers } from "@/mocks/handlers/monitoring.handler";
import { nodeHandlers } from "@/mocks/handlers/node.handler";
import { redfishHandlers } from "@/mocks/handlers/redfish.handler";
import { reportHandlers } from "@/mocks/handlers/report.handler";
import { reportReservationHandlers } from "@/mocks/handlers/report-reservation.handler";
import { requestImageHandlers } from "@/mocks/handlers/request-image.handler";
import { requestResourceHandlers } from "@/mocks/handlers/request-resource.handler";
import { revokeHistoryHandlers } from "@/mocks/handlers/revoke-history.handler";
import { smtpHandlers } from "@/mocks/handlers/smtp.handler";
import { sourcecodeHandlers } from "@/mocks/handlers/sourcecode.handler";
import { systemMonitoringHandlers } from "@/mocks/handlers/system-monitoring.handler";
import { workloadHandlers } from "@/mocks/handlers/workload.handler";

// ============================================
// Lazy Mock 지연 래퍼
// ============================================

/**
 * 환경변수에서 Mock 지연 시간 읽기
 */
function getMockDelay(): number {
  return parseInt(process.env.MOCK_DELAY ?? "0", 10);
}

/**
 * MSW 핸들러에 전역 지연을 적용하는 래퍼
 *
 * MOCK_DELAY 환경변수가 설정되면 모든 핸들러의 응답에 지연을 추가합니다.
 * 지연이 0이면 원본 핸들러를 그대로 반환합니다.
 */
function wrapHandlersWithDelay(handlers: HttpHandler[]): HttpHandler[] {
  const delayMs = getMockDelay();

  if (delayMs <= 0) {
    return handlers;
  }

  console.log(`🐢 MSW Lazy Mock: 모든 API에 ${delayMs}ms 지연 적용`);

  return handlers.map((handler) => {
    type ResolverFn = (info: unknown) => unknown;
    type HandlerWithResolver = { resolver?: ResolverFn };

    const handlerWithResolver = handler as unknown as HandlerWithResolver;
    const originalResolver = handlerWithResolver.resolver;

    if (typeof originalResolver !== "function") {
      return handler;
    }

    handlerWithResolver.resolver = async (info: unknown) => {
      await delay(delayMs);
      return originalResolver(info);
    };

    return handler;
  });
}

// ============================================
// 핸들러 통합
// ============================================

/**
 * 원본 핸들러 (지연 미적용)
 */
const rawHandlers = [
  // Override handlers (우선순위 높음)
  ...authHandlers,
  ...getAccountProfileMock(),
  ...notificationHandlers,
  ...hubHandlers,
  ...workloadHandlers,
  ...sourcecodeHandlers,
  ...volumeHandlers,
  ...getWorkspaceMemberMock(),
  ...getAdminK8sMock(),
  ...credentialHandlers,
  ...systemSettingHandlers,
  ...groupHandlers,
  ...workspaceHandlers,
  ...requestResourceHandlers,
  ...requestImageHandlers,
  ...nodeHandlers,
  ...redfishHandlers,
  ...accountManagementHandlers,
  ...monitoringHandlers,
  ...getAdminMonitoringNotificationMock(),
  ...registryHandlers,
  ...gpuHandlers,
  ...fileSecurityHandlers,
  ...registrySecurityHandlers,
  ...revokeHistoryHandlers,
  ...systemMonitoringHandlers,
  ...hpeHandlers,
  ...smtpHandlers,
  ...reportHandlers,
  ...reportReservationHandlers,
  ...resourcePresetHandlers,
  ...storageHandlers,
  ...getAdminQueueMock(),
  ...getAdminWorkloadMock(),
];

/**
 * 모든 핸들러 (전역 지연 적용)
 *
 * MOCK_DELAY 환경변수가 설정되면 모든 API 응답에 지연 적용
 * 예: MOCK_DELAY=5000 pnpm dev
 */
export const combinedHandlers = wrapHandlersWithDelay(rawHandlers);
