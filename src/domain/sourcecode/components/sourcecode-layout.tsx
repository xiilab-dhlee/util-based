"use client";

import { useAtomValue } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";
import styled from "styled-components";

import { CreateSourcecodeModal } from "@/domain/sourcecode/components/create-sourcecode-modal";
import { DeleteSourcecodeModal } from "@/domain/sourcecode/components/delete-sourcecode-modal";
import { SourcecodeListBody } from "@/domain/sourcecode/components/list/sourcecode-list-body";
import { SourcecodeListFilter } from "@/domain/sourcecode/components/list/sourcecode-list-filter";
import { SourcecodeListFooter } from "@/domain/sourcecode/components/list/sourcecode-list-footer";
import {
  SOURCECODE_PAGE_SIZE,
  SOURCECODE_SORT_FIELD_MAP,
} from "@/domain/sourcecode/constants/sourcecode.constant";
import { useGetSourcecodeListByMode } from "@/domain/sourcecode/hooks/use-get-sourcecode-list-by-mode";
import {
  sourcecodeHasMineAtom,
  sourcecodePageAtom,
  sourcecodeSearchTextAtom,
  sourcecodeSortAtom,
  sourcecodeTypeSortAtom,
} from "@/domain/sourcecode/state/sourcecode.atom";
import type { SourcecodeMode } from "@/domain/sourcecode/types/sourcecode.type";
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
    list: ROUTES.ADMIN_SOURCECODE,
    detail: ROUTES.ADMIN_SOURCECODE_DETAIL,
    pageKey: "admin.sourcecode" as const,
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
  const hasMine = useAtomValue(sourcecodeHasMineAtom);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  const routes = SOURCECODE_ROUTES[mode];
  const isSourcecodeListPage = pathname === routes.list;

  // 정렬 상태를 API 요청 형식으로 변환
  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: SOURCECODE_SORT_FIELD_MAP,
  });

  // User 모드에서만 workspaceId 사용
  const isUserMode = mode === "user";
  const workspaceId = selectedWorkspace?.workspaceId ?? -1;

  const { data, isLoading, isError } = useGetSourcecodeListByMode(
    mode,
    {
      pageNo: page - 1,
      pageSize: SOURCECODE_PAGE_SIZE,
      keyword: searchText || undefined,
      ...(isUserMode && { workspaceId, hasMine }),
      sort: sortRequest?.sort,
      order: sortRequest?.order,
      codeType: codeType ?? undefined,
    },
    {
      query: {
        // User 모드에서만 workspaceId 조건 체크
        enabled: isUserMode ? !!workspaceId : true,
      },
    },
  );

  const content = data?.content ?? [];
  const totalSize = data?.totalSize ?? 0;

  // 목록 페이지에서만 첫 번째 소스코드로 자동 리다이렉트
  useEffect(() => {
    if (content.length === 0) return;

    if (isSourcecodeListPage && content[0]) {
      router.replace(routes.detail(content[0].sourceCodeId));
    }
  }, [isSourcecodeListPage, content, router, routes]);

  return (
    <>
      <PageHeader pageKey={routes.pageKey} />
      <ListPageMain>
        <StyledListPageBody>
          <SourcecodeListFilter
            mode={mode}
            total={totalSize}
            loading={isLoading}
          />
          <SourcecodeListBody
            data={content}
            isLoading={isLoading}
            isError={isError}
            mode={mode}
          />
          <SourcecodeListFooter total={totalSize} loading={isLoading} />
        </StyledListPageBody>
        <ListPageAside $width={ASIDE_WIDTH}>{children}</ListPageAside>
      </ListPageMain>
      {/* 소스코드 삭제 모달 */}
      <DeleteSourcecodeModal mode={mode} />
      {/* 소스코드 생성 모달 */}
      <CreateSourcecodeModal />
    </>
  );
}

const StyledListPageBody = styled(ListPageBody)`
  height: 790px;
`;
