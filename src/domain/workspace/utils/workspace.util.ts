import type { RequestResourceStatusType } from "@/domain/request-resource/schemas/request-resource.schema";

/**
 * 워크스페이스 리소스 요청 상태와 텍스트, 색상을 한 번에 관리하는 매핑
 */
const REQUEST_RESOURCE_STATUS_MAP: Record<
  RequestResourceStatusType,
  Record<string, string>
> = {
  WAITING: {
    text: "승인",
    color: "blue",
    icon: "Verification02",
    iconColor: "#86B6FF",
  },
  APPROVE: {
    text: "반려",
    color: "red",
    icon: "Error",
    iconColor: "#ff8080",
  },
  REJECT: {
    text: "대기",
    color: "green",
    icon: "Waiting",
    iconColor: "rgba(104, 198, 75, 0.9)",
  },
} as const;

/**
 * 워크스페이스 리소스 요청 상태 정보 조회
 * @param status - 워크스페이스 리소스 요청 상태
 * @returns 상태에 해당하는 텍스트, 색상, 아이콘 정보
 */
export function getRequestResourceStatusInfo(
  status: RequestResourceStatusType,
): Record<string, string> {
  return REQUEST_RESOURCE_STATUS_MAP[status];
}
