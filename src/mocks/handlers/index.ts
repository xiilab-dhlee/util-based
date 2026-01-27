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
import { getAdminImageTagUsageRequestMock } from "@/api/generated/admin-image-tag-usage-request/admin-image-tag-usage-request.msw";
import { getAdminK8sMock } from "@/api/generated/admin-k8s/admin-k8s.msw";
import { getAdminMonitoringNotificationHistoryMock } from "@/api/generated/admin-monitoring-notification-history/admin-monitoring-notification-history.msw";
import { getAdminMonitoringNotificationSetMock } from "@/api/generated/admin-monitoring-notification-set/admin-monitoring-notification-set.msw";
import { getAdminQueueMock } from "@/api/generated/admin-queue/admin-queue.msw";
import { getAdminResourcePresetMock } from "@/api/generated/admin-resource-preset/admin-resource-preset.msw";
import { getAdminWorkloadMock } from "@/api/generated/admin-workload/admin-workload.msw";
import { getClusterResourceMock } from "@/api/generated/cluster-resource/cluster-resource.msw";
import { getResourcePresetMock } from "@/api/generated/resource-preset/resource-preset.msw";
import { getSmtpSettingsMock } from "@/api/generated/smtp-settings/smtp-settings.msw";
import { getWorkloadMock } from "@/api/generated/workload/workload.msw";
import { getWorkspaceMemberMock } from "@/api/generated/workspace-member/workspace-member.msw";
import { accountManagementHandlers } from "@/domain/account-management/mocks";
import { authHandlers } from "@/domain/auth/mocks";
import { credentialHandlers } from "@/domain/credential/mocks";
import { groupHandlers } from "@/domain/group/mocks";
import { nodeHandlers } from "@/domain/node/mocks";
import { notificationHandlers } from "@/domain/notification/mocks";
import { registryHandlers } from "@/domain/registry/mocks";
import { requestResourceHandlers } from "@/domain/request-resource/mocks";
import { revokeHandlers } from "@/domain/revoke/mocks";
import { fileSecurityHandlers } from "@/domain/security/mocks/file-security.handler";
import { registrySecurityHandlers } from "@/domain/security/mocks/registry-security.handler";
import { sourcecodeHandlers } from "@/domain/sourcecode/mocks";
import { storageHandlers } from "@/domain/storage/mocks";
import { systemMonitoringHandlers } from "@/domain/system-monitoring/mocks";
import { systemSettingHandlers } from "@/domain/system-setting/mocks";
import { volumeHandlers } from "@/domain/volume/mocks";
import { workspaceHandlers } from "@/domain/workspace/mocks";
import { hpeHandlers } from "@/mocks/handlers/hpe.handler";
import { hubHandlers } from "@/mocks/handlers/hub.handler";
import { monitoringHandlers } from "@/mocks/handlers/monitoring.handler";
import { reportHandlers } from "@/mocks/handlers/report.handler";
import { reportReservationHandlers } from "@/mocks/handlers/report-reservation.handler";

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
  ...requestResourceHandlers,
  ...authHandlers,
  ...getAccountProfileMock(),
  ...notificationHandlers,
  ...hubHandlers,
  ...getWorkloadMock(),
  ...sourcecodeHandlers,
  ...volumeHandlers,
  ...getWorkspaceMemberMock(),
  ...getAdminK8sMock(),
  ...credentialHandlers,
  ...systemSettingHandlers,
  ...groupHandlers,
  ...workspaceHandlers,
  ...accountManagementHandlers,
  ...monitoringHandlers,
  ...getAdminMonitoringNotificationHistoryMock(),
  ...getAdminMonitoringNotificationSetMock(),
  ...registryHandlers,
  ...fileSecurityHandlers,
  ...registrySecurityHandlers,
  ...revokeHandlers,
  ...systemMonitoringHandlers,
  ...hpeHandlers,
  ...reportHandlers,
  ...reportReservationHandlers,
  ...storageHandlers,
  ...getAdminQueueMock(),
  ...getAdminWorkloadMock(),
  ...getSmtpSettingsMock(),
  ...getAdminImageTagUsageRequestMock(),
  ...nodeHandlers,
  ...sourcecodeHandlers,
  ...getAdminResourcePresetMock(),
  ...getResourcePresetMock(),
  ...getClusterResourceMock(),
];

/**
 * 모든 핸들러 (전역 지연 적용)
 *
 * MOCK_DELAY 환경변수가 설정되면 모든 API 응답에 지연 적용
 * 예: MOCK_DELAY=5000 pnpm dev
 */
export const combinedHandlers = wrapHandlersWithDelay(rawHandlers);
