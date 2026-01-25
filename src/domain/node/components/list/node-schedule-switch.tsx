"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Switch } from "xiilab-ui";

import {
  getGetClusterNodesQueryKey,
  useUpdateNodeScheduling,
} from "@/api/generated/admin-cluster/admin-cluster";
import type { ClusterNodeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/**
 * 노드 스케줄링 상태를 제어하는 스위치 컴포넌트의 props 인터페이스
 */
interface NodeScheduleSwitchProps {
  /** 노드 이름 */
  nodeName: string;
  /** 스케줄링 가능 여부 */
  schedulable: boolean;
}

/**
 * 노드 스케줄링 스위치 컴포넌트
 *
 * 쿠버네티스 노드의 스케줄링 상태를 on/off로 제어할 수 있는 스위치입니다.
 * 스위치를 토글하면 노드의 스케줄링 설정이 즉시 업데이트됩니다.
 * Optimistic Update 패턴을 사용하여 즉각적인 UI 반응을 제공합니다.
 *
 * @param props - 컴포넌트 props
 * @returns 노드 스케줄링 제어 스위치
 *
 * @example
 * ```tsx
 * <NodeScheduleSwitch
 *   nodeName="worker-1"
 *   schedulable={true}
 * />
 * ```
 */
export function NodeScheduleSwitch({
  nodeName,
  schedulable,
}: NodeScheduleSwitchProps) {
  const queryClient = useQueryClient();
  const { mutate } = useUpdateNodeScheduling();

  /**
   * 스위치 변경 핸들러
   * Optimistic Update를 통해 즉시 UI를 업데이트하고, 서버 요청이 실패하면 롤백합니다.
   *
   * @param newChecked - 새로운 스위치 상태 (true: 스케줄링 활성화, false: 비활성화)
   */
  const handleChange = (newChecked: boolean) => {
    // Optimistic Update: 즉시 캐시 업데이트
    // exact: false로 부분 매칭하여 pageableRequest/sortRequest가 포함된 쿼리도 업데이트
    queryClient.setQueriesData<{
      content?: ClusterNodeListResponse[];
    }>({ queryKey: getGetClusterNodesQueryKey(), exact: false }, (old) => {
      if (!old?.content) return old;
      return {
        ...old,
        content: old.content.map((node) =>
          node.nodeName === nodeName
            ? { ...node, isScheduling: newChecked }
            : node,
        ),
      };
    });

    mutate(
      {
        nodeName,
        data: { enabled: newChecked },
      },
      {
        onError: () => {
          // 서버 요청 실패 시 캐시 무효화하여 원래 상태로 롤백
          queryClient.invalidateQueries({
            queryKey: getGetClusterNodesQueryKey(),
          });
        },
      },
    );
  };

  return <Switch checked={schedulable} onChange={handleChange} />;
}
