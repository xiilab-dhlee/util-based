import { WorkloadService } from "@/services/workload/workload.service";
import type { GetWorkloadsPayload } from "@/types/workload/workload.type";

/**
 * 서버 컴포넌트에서 사용할 워크로드 데이터 페칭 함수들
 *
 * React Query와 Jotai를 사용하지 않고 직접 서비스 호출
 */

const workloadService = new WorkloadService();

/**
 * 워크로드 목록 조회 (서버 사이드)
 *
 * Next.js 서버 컴포넌트에서 사용하는 데이터 페칭 함수로,
 * React Query 없이 직접 서비스를 호출하여 초기 데이터를 제공합니다.
 *
 * @param payload - 워크로드 목록 조회 파라미터
 * @returns 워크로드 목록 응답 데이터
 */
export async function getWorkloadsServer(payload: GetWorkloadsPayload) {
  try {
    const result = await workloadService.getList(payload);
    return result;
  } catch (error) {
    console.error("Failed to fetch workloads on server:", error);
    // 서버에서 에러 발생 시 빈 데이터 반환하여 페이지 렌더링 보장
    return { workloads: [], total: 0 };
  }
}

/**
 * 워크로드 상세 조회 (서버 사이드)
 *
 * 서버 컴포넌트에서 워크로드 상세 정보를 페칭합니다.
 * 에러 발생 시 null을 반환하여 안정적인 렌더링을 보장합니다.
 *
 * @param workspaceId - 워크스페이스 ID
 * @param workloadId - 워크로드 ID
 * @returns 워크로드 상세 정보 또는 null
 */
export async function getWorkloadServer(
  workspaceId: string,
  workloadId: string,
) {
  try {
    const result = await workloadService.getDetail({ workspaceId, workloadId });
    return result;
  } catch (error) {
    console.error("Failed to fetch workload detail on server:", error);
    return null;
  }
}

/**
 * 기본 검색 파라미터
 */
export const defaultWorkloadParams: GetWorkloadsPayload = {
  page: 1,
  size: 10,
  searchText: "",
};
