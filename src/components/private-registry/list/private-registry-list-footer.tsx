"use client";

import { useAtom } from "jotai";
import { useState } from "react";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import {
  privateRegistryListAtom,
  privateRegistrySelectedItemsAtom,
  // TODO: API 연동 후 활성화
  // privateRegistryListPayloadAtom,
} from "@/atoms/private-registry/private-registry-list.atom";
import { DeletePrivateRegistryModal } from "@/components/private-registry/modal/delete-private-registry-modal";
// TODO: API 연동 후 활성화
// import { useGetPrivateRegistryImages } from "@/hooks/private-registry/use-get-private-registry-images";
import { PRIVATE_REGISTRY_SAMPLE_RESPONSE } from "@/constants/private-registry/private-registry-sample.constant";
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
 * 내부 레지스트리 목록 하단 푸터 컴포넌트
 *
 * 내부 레지스트리 이미지 목록의 페이지네이션 기능을 제공합니다.
 */
export function PrivateRegistryListFooter() {
  const [filterState, setFilterState] = useAtom(privateRegistryListAtom);
  const [selectedRowKeys, setSelectedRowKeys] = useAtom(
    privateRegistrySelectedItemsAtom,
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // TODO: API 연동 후 활성화
  // const payload = useAtomValue(privateRegistryListPayloadAtom);

  // TODO: API 연동 후 활성화
  // const { data, isLoading } = useGetPrivateRegistryImages(payload);

  // 임시 샘플 데이터 사용
  const data = PRIVATE_REGISTRY_SAMPLE_RESPONSE;
  const isLoading = false;

  /** 페이지 변경 핸들러 */
  const handlePageChange = (page: number) => {
    setFilterState((prev) => ({
      ...prev,
      page,
    }));
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = () => {
    if (selectedRowKeys.length > 0) {
      setDeleteModalOpen(true);
    }
  };

  // 삭제 확인 핸들러
  const handleDeleteConfirm = () => {
    // TODO: API 연동 후 실제 삭제 로직 구현
    console.log("삭제할 이미지 ID:", selectedRowKeys);
    setDeleteModalOpen(false);
    setSelectedRowKeys([]);
  };

  // 삭제 모달 닫기 핸들러
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  return (
    <>
      <FooterContainer>
        <ListPageFooter
          total={data?.total || 0}
          page={filterState.page}
          pageSize={filterState.size}
          onChange={handlePageChange}
          isLoading={isLoading}
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

      <DeletePrivateRegistryModal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}

