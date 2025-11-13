"use client";

import { useState } from "react";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import { ListPageFooter } from "@/layouts/list/list-page-footer";

const FooterContainer = styled.div`
  position: relative;
`;

const DeleteButtonContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 10;
`;

/**
 * 내부 레지스트리 상세 페이지 하단 푸터 컴포넌트
 *
 * 페이지네이션과 삭제 버튼을 포함합니다.
 */
export function PrivateRegistryDetailFooter() {
  const [currentPage, setCurrentPage] = useState(1);
  const selectedRowKeys: string[] = [];

  // TODO: 실제 데이터로 변경
  const total = 124;
  const pageSize = 20;

  /** 페이지 변경 핸들러 */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = () => {
    if (selectedRowKeys.length > 0) {
      // TODO: 삭제 모달 구현
      console.log("삭제할 태그:", selectedRowKeys);
    }
  };

  return (
    <FooterContainer>
      <ListPageFooter
        total={total}
        page={currentPage}
        pageSize={pageSize}
        onChange={handlePageChange}
        isLoading={false}
      />
      <DeleteButtonContainer>
        <Button
          size="small"
          disabled={selectedRowKeys.length === 0}
          variant="outlined"
          onClick={handleDeleteClick}
        >
          삭제
        </Button>
      </DeleteButtonContainer>
    </FooterContainer>
  );
}

