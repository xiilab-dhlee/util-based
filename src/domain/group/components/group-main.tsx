"use client";

import { useAtom, useAtomValue } from "jotai";
import type { FormEvent } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import { AccountButton } from "@/domain/group/components/account-button";
import { DeleteGroupModal } from "@/domain/group/components/delete-group-modal";
import {
  AccountDetailPanel,
  GroupDetailPanel,
} from "@/domain/group/components/detail-panel";
import { GroupButton } from "@/domain/group/components/group-button";
import { useGetAllGroups } from "@/domain/group/hooks/use-get-all-groups";
import {
  groupSelectedIdAtom,
  groupSelectedInfoAtom,
  groupTreeDataAtom,
} from "@/domain/group/state/group.atom";
import { OPEN_GROUP_MODAL_CREATE_PAYLOAD } from "@/domain/group/types/group.type";
import { SearchInput } from "@/shared/components/input/search-input";
import { GroupTree } from "@/shared/components/tree/group-tree";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import { GROUP_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { GROUP_TREE_NODE_TYPE } from "@/shared/schemas/group-tree.schema";
import {
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";

/**
 * 계정 관리 메인 컴포넌트
 *
 * 그룹 시스템을 관리하는 메인 컴포넌트로, 그룹 트리와 그룹 목록을
 * 좌우 분할 레이아웃으로 표시합니다. 그룹 추가, 삭제 등의
 * 기능을 제공합니다.
 *
 * @returns 계정 관리 인터페이스
 */
export function GroupMain() {
  const publish = usePublish();

  // 그룹 트리 데이터 상태 관리
  const [treeData, setTreeData] = useAtom(groupTreeDataAtom);
  // 선택된 노드 정보
  const selectedInfo = useAtomValue(groupSelectedInfoAtom);
  // 선택된 노드 ID
  const selectedId = useAtomValue(groupSelectedIdAtom);

  // 그룹 목록 조회 훅
  const { data } = useGetAllGroups();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("searched");
  };

  const handleCreateGroup = () => {
    publish(GROUP_EVENTS.openGroupModal, OPEN_GROUP_MODAL_CREATE_PAYLOAD);
  };

  useEffect(() => {
    if (data?.content) {
      setTreeData(data.content);
    }
  }, [data?.content, setTreeData]);

  /**
   * 오른쪽 패널 렌더링
   */
  const renderDetailPanel = () => {
    // 전체 선택 또는 선택 없음
    if (
      !selectedInfo ||
      selectedId?.toUpperCase() === ALL_OPTION.value.toUpperCase()
    ) {
      return (
        <EmptyPanel>
          <EmptyMessage>그룹 또는 계정을 선택해주세요.</EmptyMessage>
        </EmptyPanel>
      );
    }

    // 그룹 선택
    if (selectedInfo.nodeType === GROUP_TREE_NODE_TYPE.group) {
      return <GroupDetailPanel group={selectedInfo} />;
    }

    // 계정 선택
    return <AccountDetailPanel account={selectedInfo} />;
  };

  return (
    <>
      <Container>
        {/* 계정 관리 헤더 영역 */}
        <DetailContentHeader>
          <DetailContentTitle>계정 관리</DetailContentTitle>
          {/* 계정 관리 도구 버튼들 */}
          <DetailContentTitleTool>
            <Button
              color="primary"
              icon="Plus"
              iconPosition="left"
              variant="gradient"
              width={100}
              height={30}
              onClick={handleCreateGroup}
            >
              그룹 추가
            </Button>
          </DetailContentTitleTool>
        </DetailContentHeader>

        {/* 그룹 내용 - 좌우 분할 레이아웃 */}
        <Content>
          {/* 왼쪽: 그룹 트리 영역 */}
          <Left>
            <ContentHeader>
              <ContentTitle>그룹 목록</ContentTitle>
            </ContentHeader>
            <SearchForm onSubmit={handleSubmit}>
              <SearchInput
                width="100%"
                placeholder="그룹 이름을 검색해 주세요."
              />
            </SearchForm>

            {/* 그룹 트리 컴포넌트 */}
            <GroupTree
              treeData={treeData}
              groupButton={GroupButton}
              accountButton={AccountButton}
              showRootNode
            />
          </Left>

          {/* 오른쪽: 선택된 노드에 따른 상세 패널 */}
          {renderDetailPanel()}
        </Content>
      </Container>
      {/* 그룹 삭제 모달 */}
      <DeleteGroupModal />
    </>
  );
}

const Container = styled.div`
  padding: 24px 28px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow: hidden;
`;

const Left = styled.div`
  width: 334px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

const ContentTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000;
`;

const SearchForm = styled.form`
  margin-bottom: 16px;
`;

const EmptyPanel = styled.div`
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmptyMessage = styled.div`
  color: #828588;
  font-size: 14px;
`;
