import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { DeleteSourcecodeModal } from "@/domain/sourcecode/components/delete-sourcecode-modal";
import { SourcecodeListBody } from "@/domain/sourcecode/components/list/sourcecode-list-body";
import { SourcecodeListFilter } from "@/domain/sourcecode/components/list/sourcecode-list-filter";
import { SourcecodeListFooter } from "@/domain/sourcecode/components/list/sourcecode-list-footer";
import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

export const metadata: Metadata = {
  title: "Source Code",
};

export default function SourcecodeLayout({ children }: PropsWithChildren) {
  return (
    <>
      <PageHeader
        pageKey="user.sourcecode"
        description="Source code"
      />
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
