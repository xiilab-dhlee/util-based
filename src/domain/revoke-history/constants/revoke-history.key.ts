import type {
  GetRevokeHistoriesPayload,
  GetRevokeHistoryDetailPayload,
} from "@/domain/revoke-history/types/revoke-history.type";

/**
 * 리소스 회수 이력 React Query 키
 */
export const revokeHistoryKeys = {
  all: ["revoke-history"] as const,
  list: (payload: GetRevokeHistoriesPayload) =>
    [...revokeHistoryKeys.all, "list", payload] as const,
  detail: (id: string, payload?: GetRevokeHistoryDetailPayload) =>
    [...revokeHistoryKeys.all, "detail", id, payload] as const,
  criteria: () => [...revokeHistoryKeys.all, "criteria"] as const,
};
