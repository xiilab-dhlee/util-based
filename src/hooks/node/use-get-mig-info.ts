import { useLazyQuery } from "@/hooks/common/use-lazy-query";
import { useServices } from "@/providers/service-provider";
import type { NodeMigInfo } from "@/types/node/node.type";

/**
 * 노드 MIG 설정 조회 (Lazy Query)
 *
 * 모달이 열릴 때 수동으로 호출하여 MIG 정보를 조회합니다.
 *
 * @returns useLazyQuery 결과
 */
export const useGetNodeMigInfo = () => {
  const { nodeService } = useServices();

  return useLazyQuery<{ nodeName: string }, NodeMigInfo>({
    queryFn: async ({ nodeName }) => {
      const response = await nodeService.getMigInfo(nodeName);
      return response.data;
    },
  });
};
