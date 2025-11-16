import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { DeleteSourcecodeModal } from "@/components/sourcecode/delete-sourcecode-modal";
import { SourcecodeListBody } from "@/components/sourcecode/list/sourcecode-list-body";
import { SourcecodeListFilter } from "@/components/sourcecode/list/sourcecode-list-filter";
import { SourcecodeListFooter } from "@/components/sourcecode/list/sourcecode-list-footer";
import { STANDARD_ROOT_BREADCRUMB_ITEM } from "@/constants/common/core.constant";
import { PageHeader } from "@/layouts/common/page-header";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  STANDARD_ROOT_BREADCRUMB_ITEM,
  { title: "소스코드" },
];

export const metadata: Metadata = {
  title: "Source Code",
};

export default function SourcecodeLayout({ children }: PropsWithChildren) {
  return (
    <>
      <PageHeader title="소스코드" icon="SourceCode" description="Source code">
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>
      {/* 소스코드 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 소스코드 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 소스코드 목록 필터 */}
          <SourcecodeListFilter />
          {/* 소스코드 목록 본문 */}
          <SourcecodeListBody />
          {/* 소스코드 목록 페이지네이션 */}
          <SourcecodeListFooter />
        </ListPageBody>
        {/* 소스코드 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={620}>{children}</ListPageAside>
      </ListPageMain>
      {/* 소스코드 삭제 모달 */}
      <DeleteSourcecodeModal />
    </>
  );
}
