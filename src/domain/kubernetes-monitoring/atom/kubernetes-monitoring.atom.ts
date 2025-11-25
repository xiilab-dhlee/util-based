import { atomWithReset } from "jotai/utils";

import {
  KUBERNETES_RESOURCE_NAMES,
  type KubernetesResourceName,
} from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";

/** 쿠버네티스 리소스 리스트 페이지 번호 */
export const kubernetesResourcePageAtom = atomWithReset<number>(1);

/** 쿠버네티스 리소스 리스트 검색어 */
export const kubernetesResourceKeywordAtom = atomWithReset<string>("");

/** 쿠버네티스 리소스 상태 필터 */
export const kubernetesResourceStatusAtom = atomWithReset<string | null>(null);

/** 선택된 리소스 이름 (Nodes, Pods 등) */
export const kubernetesSelectedResourceNameAtom =
  atomWithReset<KubernetesResourceName>(KUBERNETES_RESOURCE_NAMES[0]);

/** 쿠버네티스 이벤트 상세 모달 open 상태 */
export const openKubernetesEventDetailModalAtom = atomWithReset<boolean>(false);

/** 쿠버네티스 Describe 모달 open 상태 */
export const openKubernetesDescribeModalAtom = atomWithReset<boolean>(false);
