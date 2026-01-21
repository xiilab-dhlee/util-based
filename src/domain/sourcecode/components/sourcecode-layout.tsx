"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { usePathname, useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";

import { useGetSourceCodeList } from "@/api/generated/source-code/source-code";
import { CreateSourcecodeModal } from "@/domain/sourcecode/components/create-sourcecode-modal";
import { DeleteSourcecodeModal } from "@/domain/sourcecode/components/delete-sourcecode-modal";
import { SourcecodeListBody } from "@/domain/sourcecode/components/list/sourcecode-list-body";
import { SourcecodeListFilter } from "@/domain/sourcecode/components/list/sourcecode-list-filter";
import { SourcecodeListFooter } from "@/domain/sourcecode/components/list/sourcecode-list-footer";
import {
  SOURCECODE_PAGE_SIZE,
  SOURCECODE_SORT_FIELD_MAP,
} from "@/domain/sourcecode/constants/sourcecode.constant";
import {
  sourcecodeCheckedListAtom,
  sourcecodePageAtom,
  sourcecodeSearchTextAtom,
  sourcecodeSortAtom,
  sourcecodeTypeSortAtom,
} from "@/domain/sourcecode/state/sourcecode.atom";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { buildSortRequest } from "@/shared/utils/sort.util";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

type SourcecodeMode = "user" | "admin";

interface SourcecodeLayoutProps extends PropsWithChildren {
  mode: SourcecodeMode;
}

const SOURCECODE_ROUTES = {
  user: {
    list: ROUTES.USER_SOURCECODE,
    detail: ROUTES.USER_SOURCECODE_DETAIL,
    pageKey: "user.sourcecode" as const,
  },
  admin: {
    list: ROUTES.ADMIN_SOURCECODE_MANAGEMENT,
    detail: (id: string) => `${ROUTES.ADMIN_SOURCECODE_MANAGEMENT}/${id}`,
    pageKey: "admin.sourcecode-management" as const,
  },
};

/**
 * Sourcecode 페이지 공통 레이아웃
 *
 * User/Admin 모드에 따라 라우트와 API 호출 방식이 달라집니다.
 * - User 모드: workspaceId 기반 소스코드 조회
 * - Admin 모드: 전체 소스코드 조회
 */
export function SourcecodeLayout({ mode, children }: SourcecodeLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const page = useAtomValue(sourcecodePageAtom);
  const searchText = useAtomValue(sourcecodeSearchTextAtom);
  const sort = useAtomValue(sourcecodeSortAtom);
  const codeType = useAtomValue(sourcecodeTypeSortAtom);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const resetCheckedList = useResetAtom(sourcecodeCheckedListAtom);

  const routes = SOURCECODE_ROUTES[mode];
  const isSourcecodeListPage = pathname === routes.list;

  // 정렬 상태를 API 요청 형식으로 변환
  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: SOURCECODE_SORT_FIELD_MAP,
  });

  const workspaceId = selectedWorkspace?.workspaceId;

  const { data, isLoading, isError } = useGetSourceCodeList(
    {
      pageNo: page - 1,
      pageSize: SOURCECODE_PAGE_SIZE,
      keyword: searchText || undefined,
      workspaceId,
      sort: sortRequest?.sort,
      order: sortRequest?.order,
      codeType: codeType ?? undefined,
    },
    {
      query: {
        enabled: !!workspaceId,
      },
    },
  );

  const content = data?.content ?? [];
  const totalSize = data?.totalSize ?? 0;

  // 데이터 변경 시 체크 상태 초기화 (검색, 필터, 정렬, 페이지 이동 등)
  // biome-ignore lint/correctness/useExhaustiveDependencies: 데이터 변경 시 체크 상태 초기화
  useEffect(() => {
    resetCheckedList();
  }, [content, resetCheckedList]);

  // 목록 페이지에서만 첫 번째 소스코드로 자동 리다이렉트
  useEffect(() => {
    if (content.length === 0) return;

    if (isSourcecodeListPage && content[0]) {
      router.replace(routes.detail(String(content[0].sourceCodeId)));
    }
  }, [isSourcecodeListPage, content, router, routes]);

  return (
    <>
      <PageHeader pageKey={routes.pageKey} />
      <ListPageMain>
        <ListPageBody>
          <SourcecodeListFilter total={totalSize} loading={isLoading} />
          <SourcecodeListBody
            data={content}
            isLoading={isLoading}
            isError={isError}
          />
          <SourcecodeListFooter total={totalSize} loading={isLoading} />
        </ListPageBody>
        <ListPageAside $width={ASIDE_WIDTH}>{children}</ListPageAside>
      </ListPageMain>
      {/* 소스코드 삭제 모달 */}
      <DeleteSourcecodeModal />
      {/* 소스코드 생성 모달 */}
      <CreateSourcecodeModal />
    </>
  );
}
