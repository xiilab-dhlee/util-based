import type { NodeCondition } from "@/types/node/node.model";

/**
 * 노드가 실행 중인지 확인
 * @param nodeCondition - 노드 조건 배열
 * @returns 실행 중 여부
 */
export function isNodeRunning(nodeCondition: NodeCondition[]): boolean {
  const readyCondition = nodeCondition.find(
    (condition: NodeCondition) => condition.type === "Ready",
  );

  return readyCondition?.status === "True" || false;
}
