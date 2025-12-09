"use client";

import { isNull } from "es-toolkit";
import { useAtomValue } from "jotai";

import { AsideSourcecode } from "@/domain/sourcecode/components/aside-sourcecode";
import { CreateSourcecodeModal } from "@/domain/sourcecode/components/create-sourcecode-modal";
import { DeleteSourcecodeModal } from "@/domain/sourcecode/components/delete-sourcecode-modal";
import { SourcecodeListBody } from "@/domain/sourcecode/components/sourcecode-list-body";
import { SourcecodeListFilter } from "@/domain/sourcecode/components/sourcecode-list-filter";
import { SourcecodeListFooter } from "@/domain/sourcecode/components/sourcecode-list-footer";
import { useGetSourcecodes } from "@/domain/sourcecode/hooks/use-get-sourcecodes";
import {
  sourcecodePageAtom,
  sourcecodeSearchTextAtom,
  sourcecodeTypeAtom,
} from "@/domain/sourcecode/state/sourcecode.atom";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ASIDE_WIDTH, LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

/**
 * 소스코드 목록 페이지의 메인 컴포넌트
 *
 * 이 컴포넌트는 소스코드 목록을 표시하는 페이지의 주요 레이아웃을 담당합니다.
 * 소스코드 생성 가이드, 필터링, 목록 표시, 페이지네이션, 상세 정보 등의 기능을 포함합니다.
 *
 * @returns 소스코드 목록 페이지 JSX
 */
export function SourcecodeListMain() {
  const page = useAtomValue(sourcecodePageAtom);
  const searchText = useAtomValue(sourcecodeSearchTextAtom);
  const codeType = useAtomValue(sourcecodeTypeAtom);

  const { data, isLoading } = useGetSourcecodes({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
    type: isNull(codeType) ? undefined : codeType,
  });

  return (
    <>
      <PageHeader pageKey="user.sourcecode" description="Source code" />
      <ListPageMain>
        <ListPageBody>
          <SourcecodeListFilter
            total={data?.totalSize || 0}
            loading={isLoading}
          />
          <SourcecodeListBody
            content={data?.content || []}
            loading={isLoading}
          />
          <SourcecodeListFooter
            total={data?.totalSize || 0}
            loading={isLoading}
          />
        </ListPageBody>
        <ListPageAside $width={ASIDE_WIDTH}>
          <AsideSourcecode />
        </ListPageAside>
      </ListPageMain>
      {/* 소스코드 삭제 모달 */}
      <DeleteSourcecodeModal />
      {/* 소스코드 생성 모달 */}
      <CreateSourcecodeModal />
    </>
  );
}
