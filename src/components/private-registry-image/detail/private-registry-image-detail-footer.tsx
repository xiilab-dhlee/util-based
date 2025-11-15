"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import {
  privateRegistryImageTagCheckedListAtom,
  privateRegistryImageTagPageAtom,
  privateRegistryImageTagSearchTextAtom,
} from "@/atoms/private-registry-image/private-registry-image.atom";
import privateRegistryImageDetailConstants from "@/constants/registry/private-registry-image-detail.constant";
import { useGetPrivateRegistryImageTags } from "@/hooks/registry/use-get-private-registry-image-tags";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

/**
 * 내부 레지스트리 이미지 태그 목록 페이지네이션 컴포넌트
 *
 * 페이지네이션과 삭제 버튼을 제공합니다.
 */
export function PrivateRegistryImageDetailFooter() {
  const [page, setPage] = useAtom(privateRegistryImageTagPageAtom);
  const searchText = useAtomValue(privateRegistryImageTagSearchTextAtom);
  const setCheckedList = useSetAtom(privateRegistryImageTagCheckedListAtom);
  const checkedList = useAtomValue(privateRegistryImageTagCheckedListAtom);

  const { data, isLoading } = useGetPrivateRegistryImageTags({
    page,
    size: privateRegistryImageDetailConstants.tagPageSize,
    searchText,
    imageId: 1,
  });

  const handleDelete = () => {
    if (checkedList.size === 0) {
      alert("삭제할 태그를 선택해주세요.");
      return;
    }

    const isConfirmed = window.confirm(
      `선택한 ${checkedList.size}개의 태그를 삭제하시겠습니까?`,
    );

    if (isConfirmed) {
      console.log("삭제할 태그 ID 목록:", Array.from(checkedList));
      setCheckedList(new Set());
    }
  };

  const handlePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <FooterContainer>
      <ListPageFooter
        total={data?.total || 0}
        page={page}
        pageSize={privateRegistryImageDetailConstants.tagPageSize}
        onChange={handlePage}
        isLoading={isLoading}
        rightChildren={
          <Button
            width={80}
            size="small"
            variant="outlined"
            onClick={handleDelete}
            disabled={checkedList.size === 0}
          >
            삭제
          </Button>
        }
      />
    </FooterContainer>
  );
}

const FooterContainer = styled.div`
  position: relative;
`;
