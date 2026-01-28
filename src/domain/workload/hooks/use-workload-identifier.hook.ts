"use client";

import { useAtomValue } from "jotai";
import { useParams, useSearchParams } from "next/navigation";

import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

interface UseWorkloadIdentifierReturn {
  /** 워크로드 리소스 이름 (URL params) */
  workloadResourceName: string;
  /** 워크스페이스 ID (URL params 또는 selectedWorkspaceAtom) */
  workspaceId: number | null;
  /** 식별자 유효성 (둘 다 존재하는지) */
  isValid: boolean;
}

/**
 * 워크로드 식별자 관리 훅
 *
 * URL 파라미터에서 워크로드 리소스 이름을 추출하고,
 * workspaceId는 URL 쿼리 파라미터 또는 selectedWorkspaceAtom에서 가져옵니다.
 *
 * @example
 * const { workloadResourceName, workspaceId, isValid } = useWorkloadIdentifier();
 * if (!isValid) return <Error>워크로드를 찾을 수 없습니다</Error>;
 */
export function useWorkloadIdentifier(): UseWorkloadIdentifierReturn {
  const params = useParams();
  const searchParams = useSearchParams();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  // URL 파라미터에서 워크로드 리소스 이름 추출
  const workloadResourceName = String(params?.id ?? "");

  // workspaceId: URL 쿼리 파라미터 우선, 없으면 selectedWorkspaceAtom에서
  const workspaceId = searchParams?.get("workspaceId")
    ? Number(searchParams.get("workspaceId"))
    : (selectedWorkspace?.workspaceId ?? null);

  // 유효성 검증: 둘 다 존재해야 함
  const isValid = Boolean(
    workloadResourceName && workspaceId && !Number.isNaN(workspaceId),
  );

  return {
    workloadResourceName,
    workspaceId,
    isValid,
  };
}
