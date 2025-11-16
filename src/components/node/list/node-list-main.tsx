"use client";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { ADMIN_ROOT_BREADCRUMB_ITEM } from "@/constants/common/core.constant";
import { NODE_GUIDE_IMAGES, NODE_GUIDES } from "@/constants/node/node.constant";
import { PageGuide } from "@/layouts/common/page-guide";
import { PageHeader } from "@/layouts/common/page-header";
import { PageImageGuide } from "@/layouts/common/page-image-guide";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";
import { UpdateMigModal } from "../mig/update-mig-modal";
import { UpdateMpsModal } from "../mig/update-mps-modal";
import { NodeListBody } from "./node-list-body";
import { NodeListFilter } from "./node-list-filter";
import { NodeListFooter } from "./node-list-footer";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  ADMIN_ROOT_BREADCRUMB_ITEM,
  { title: "노드 관리" },
];

export function NodeListMain() {
  return (
    <>
      <PageHeader
        title="노드관리"
        icon="ComparativeExperiment"
        description="Node Management"
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>

      {/* 노드 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 노드 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <PageGuide
            titleEng="About Node Management"
            title="노드관리"
            icon="Monitoring01"
            backgroundImageName="node-intro-background.png"
            description={[
              "클러스터 내 노드들의 자원 상태, GPU 분할 모드, 스케줄링",
              "여부 등을 종합적으로 확인하고 개별 노드의",
              "Activity 상세 확인 가능",
            ]}
            guides={NODE_GUIDES}
          />

          {/* 노드 가이드 이미지 카드 */}
          <PageImageGuide
            title="노드 관리 가이드"
            guideImages={NODE_GUIDE_IMAGES}
          />
        </ListPageAside>
        {/* 노드 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 노드 목록 필터 */}
          <NodeListFilter />
          {/* 노드 목록 본문 */}
          <NodeListBody />
          {/* 노드 목록 페이지네이션 */}
          <NodeListFooter />
        </ListPageBody>
      </ListPageMain>
      {/* MPS 설정 모달 */}
      <UpdateMpsModal />
      {/* MIG 설정 모달 */}
      <UpdateMigModal />
    </>
  );
}
