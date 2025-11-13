"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

import { workloadKeys } from "@/constants/workload/workload.key";
import { useServices } from "@/providers/service-provider";
import type { WorkloadListType } from "@/schemas/workload.schema";
import type { CoreListResponse } from "@/types/common/core.model";
import type { GetWorkloadsPayload } from "@/types/workload/workload.type";
import { isAdminMode } from "@/utils/common/router.util";

/**
 * 워크로드 목록 조회 (모드에 따라 다른 서비스 사용)
 *
 * 현재 경로가 관리자 모드인지 확인하여 적절한 서비스를 선택하고
 * 해당 서비스를 통해 워크로드 목록을 조회합니다.
 *
 * 관리자 모드인 경우 `adminWorkloadService`를 사용하고,
 * 일반 사용자 모드인 경우 `workloadService`를 사용합니다.
 *
 * @param payload - 워크로드 목록 조회에 필요한 페이로드 (페이지 번호, 검색어 등)
 * @returns React Query의 UseQueryResult 객체
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useGetWorkloadsByMode({
 *   page: 1,
 *   size: 10,
 *   searchText: "검색어",
 * });
 * ```
 */
export const useGetWorkloadsByMode = (
  payload: GetWorkloadsPayload,
): UseQueryResult<CoreListResponse<WorkloadListType>, Error> => {
  // 현재 경로명을 가져와서 모드 판별에 사용
  const pathname = usePathname();

  // 워크로드 관련 서비스들을 가져옴
  const { workloadService, adminWorkloadService } = useServices();

  // 현재 경로가 관리자 모드인지 확인
  const isAdmin = isAdminMode(pathname);

  // 모드에 따라 적절한 쿼리 키와 쿼리 함수를 설정
  let queryKey: string[];
  let queryFn: () => Promise<CoreListResponse<WorkloadListType>>;
  if (isAdmin) {
    // 관리자 모드: 관리자 전용 서비스와 쿼리 키 사용
    queryKey = workloadKeys.adminList(payload);
    queryFn = async () => {
      const response = await adminWorkloadService.getList(payload);
      return response.data;
    };
  } else {
    // 일반 사용자 모드: 일반 서비스와 쿼리 키 사용
    queryKey = workloadKeys.list(payload);
    queryFn = async () => {
      const response = await workloadService.getList(payload);
      return response.data;
    };
  }

  // React Query를 사용하여 데이터 조회
  return useQuery({
    queryKey,
    queryFn,
  });
};
