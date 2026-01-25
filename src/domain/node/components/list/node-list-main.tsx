"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";
import { Icon } from "xiilab-ui";

import { useGetClusterNodes } from "@/api/generated/admin-cluster/admin-cluster";
import { NodeListBody } from "@/domain/node/components/list/node-list-body";
import { NodeListFilter } from "@/domain/node/components/list/node-list-filter";
import { NodeListFooter } from "@/domain/node/components/list/node-list-footer";
import { UpdateMigModal } from "@/domain/node/components/mig/update-mig-modal";
import { UpdateMpsModal } from "@/domain/node/components/mig/update-mps-modal";
import { NODE_MENU_ICON } from "@/domain/node/constants/node.constant";
import { NODE_SORT_FIELD_MAP } from "@/domain/node/constants/node-list.constant";
import { nodePageAtom, nodeSortAtom } from "@/domain/node/state/node.atom";
import { PageGuide } from "@/shared/components/layouts/page-guide";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { PageImageGuide } from "@/shared/components/layouts/page-image-guide";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import type { CoreGuide, CoreGuideImage } from "@/shared/types/core.model";
import { buildSortRequest } from "@/shared/utils/sort.util";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

const GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/node-guide1.png",
    alt: "노드 가이드 1",
  },
  {
    id: "2",
    src: "/images/node-guide2.png",
    alt: "노드 가이드 2",
  },
  {
    id: "3",
    src: "/images/node-guide3.png",
    alt: "노드 가이드 3",
  },
];

const GUIDES: CoreGuide[] = [
  {
    icon: <Icon name="Mps" size={24} color="var(--icon-fill)" />,
    title: "MPS",
    description: [
      "GPU를 MPS 방식으로 분할 설정하여,동일 GPU 자원을",
      "다수 작업에서 효율적으로 활용하도록 구성합니다.",
    ],
  },
  {
    icon: <Icon name="Mig" size={24} color="var(--icon-fill)" />,
    title: "MIG",
    description: [
      "GPU를 MIG방식으로 분할 설정하여, 하나의 GPU 자원을",
      "여러 작업에 효율적으로 분배하고 병렬 처리가능",
    ],
  },
];

export function NodeListMain() {
  const resetPage = useResetAtom(nodePageAtom);
  const resetSort = useResetAtom(nodeSortAtom);

  const page = useAtomValue(nodePageAtom);
  const sort = useAtomValue(nodeSortAtom);

  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: NODE_SORT_FIELD_MAP,
  });

  const { data, isLoading, isError } = useGetClusterNodes({
    pageableRequest: {
      pageNo: page - 1,
      pageSize: LIST_PAGE_SIZE,
    },
    sortRequest: sortRequest ?? { sort: "NODE_NAME", order: "ASC" },
  });

  useEffect(() => {
    resetPage();
    resetSort();
  }, [resetPage, resetSort]);

  return (
    <>
      <PageHeader pageKey="admin.node" />

      {/* 노드 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 노드 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <PageGuide
            title="노드 관리"
            icon={NODE_MENU_ICON}
            backgroundImageName="node-intro-background.png"
            description={[
              "클러스터 내 노드들의 자원 상태, GPU 분할 모드, 스케줄링",
              "여부 등을 종합적으로 확인하고 개별 노드의",
              "Activity 상세 확인 가능",
            ]}
            guides={GUIDES}
          />

          {/* 노드 가이드 이미지 카드 */}
          <PageImageGuide title="노드 관리 가이드" guideImages={GUIDE_IMAGES} />
        </ListPageAside>
        {/* 노드 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 노드 목록 필터 */}
          <NodeListFilter total={data?.totalSize || 0} />
          {/* 노드 목록 본문 */}
          <NodeListBody
            content={data?.content || []}
            loading={isLoading}
            isError={isError}
          />
          {/* 노드 목록 페이지네이션 */}
          <NodeListFooter total={data?.totalSize || 0} loading={isLoading} />
        </ListPageBody>
      </ListPageMain>
      {/* MPS 설정 모달 */}
      <UpdateMpsModal />
      {/* MIG 설정 모달 */}
      <UpdateMigModal />
    </>
  );
}
