"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

import { workloadKeys } from "@/constants/workload/workload.key";
import { useServices } from "@/providers/service-provider";
import type { WorkloadDetailType } from "@/schemas/workload.schema";
import type { GetWorkloadPayload } from "@/types/workload/workload.type";
import { isAdminMode } from "@/utils/common/router.util";

/**
 * 워크로드 상세 조회 (모드에 따라 다른 서비스 사용)
 *
 * 현재 경로가 관리자 모드인지 확인하여 적절한 서비스를 선택하고
 * 해당 서비스를 통해 워크로드 상세 정보를 조회합니다.
 *
 * @param payload - 워크로드 조회에 필요한 페이로드 (ID 등)
 * @returns React Query의 UseQueryResult 객체
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useGetWorkloadByMode({ id: "workload-123" });
 * ```
 */
export const useGetWorkloadByMode = (
  payload: GetWorkloadPayload,
): UseQueryResult<WorkloadDetailType, Error> => {
  // 현재 경로명을 가져와서 모드 판별에 사용
  const pathname = usePathname();

  // 워크로드 관련 서비스들을 가져옴
  const { workloadService, adminWorkloadService } = useServices();

  // 현재 경로가 관리자 모드인지 확인
  const isAdmin = isAdminMode(pathname);

  // 모드에 따라 적절한 쿼리 키와 쿼리 함수를 설정
  let queryKey: string[];
  let queryFn: () => Promise<WorkloadDetailType>;
  if (isAdmin) {
    // 관리자 모드: 관리자 전용 서비스와 쿼리 키 사용
    queryKey = workloadKeys.adminDetail(payload);
    queryFn = async () => {
      const response = await adminWorkloadService.getDetail(payload);
      return response.data;
    };
  } else {
    // 일반 사용자 모드: 일반 서비스와 쿼리 키 사용
    queryKey = workloadKeys.detail(payload);
    queryFn = async () => {
      const response = await workloadService.getDetail(payload);
      return response.data;
    };
  }

  // React Query를 사용하여 데이터 조회
  return useQuery({
    queryKey,
    queryFn,
  });
};
