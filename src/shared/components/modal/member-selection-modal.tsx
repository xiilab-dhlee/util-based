"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Button, Icon, Modal } from "xiilab-ui";

import { useGetAllGroups } from "@/domain/group/hooks/use-get-all-groups";
import { FileTreeButton } from "@/shared/components/button/file-tree-button";
import type { MemberRow } from "@/shared/components/column/create-member-column";
import { SearchInput } from "@/shared/components/input/search-input";
import { GroupTree } from "@/shared/components/tree/group-tree";
import type { GroupTreeButtonProps } from "@/shared/components/tree/group-tree-node";
import {
  GROUP_TREE_NODE_TYPE,
  type GroupTreeNodeType,
  type GroupTreeType,
} from "@/shared/schemas/group-tree.schema";
import type { SelectedMember } from "@/shared/types/member-selection.type";
import {
  countAccountsInGroup,
  flattenSelectedMembers,
  flattenTree,
} from "@/shared/utils/group-tree.util";

interface MemberSelectionModalProps {
  /** 모달 열림 상태 */
  open: boolean;
  /** 모달 제목 */
  title: string;
  /** 초기 선택된 계정 목록 */
  initialAccounts: SelectedMember[];
  /** 확인 버튼 클릭 시 콜백 (평탄화된 멤버 목록 전달) */
  onConfirm: (members: MemberRow[]) => void;
  /** 취소/닫기 콜백 */
  onClose: () => void;
}

/**
 * 멤버 선택 모달 (공통 컴포넌트)
 *
 * 그룹 트리에서 계정/그룹을 선택하고 평탄화된 멤버 목록을 반환
 */
export function MemberSelectionModal({
  open,
  title,
  initialAccounts,
  onConfirm,
  onClose,
}: MemberSelectionModalProps) {
  const { data, isLoading } = useGetAllGroups();
  const treeData = data?.content ?? [];

  const nodeMap = useMemo(
    () => new Map(flattenTree(treeData).map((node) => [node.id, node])),
    [treeData],
  );

  // 모달 내부 선택 상태
  const [selectedAccounts, setSelectedAccounts] = useState<SelectedMember[]>(
    [],
  );
  const [selectedGroups, setSelectedGroups] = useState<SelectedMember[]>([]);

  // initialAccounts prop이 변경될 때 상태 동기화
  // selectedGroups는 모달 내부에서만 유효하므로 항상 초기화
  useEffect(() => {
    setSelectedAccounts(initialAccounts);
    setSelectedGroups([]);
  }, [initialAccounts]);

  // 모달이 열릴 때 초기값으로 리셋
  const resetToInitial = useCallback(() => {
    setSelectedAccounts(initialAccounts);
    setSelectedGroups([]);
  }, [initialAccounts]);

  // 노드 선택/해제
  const handleSelectNode = useCallback((node: GroupTreeType) => {
    const isAccount = node.nodeType === GROUP_TREE_NODE_TYPE.account;
    const member: SelectedMember = {
      id: node.id,
      name: node.name,
      email: isAccount ? node.email : undefined,
      type: isAccount
        ? GROUP_TREE_NODE_TYPE.account
        : GROUP_TREE_NODE_TYPE.group,
    };

    const setter = isAccount ? setSelectedAccounts : setSelectedGroups;
    setter((prev) => {
      const exists = prev.some((item) => item.id === node.id);
      return exists
        ? prev.filter((item) => item.id !== node.id)
        : [...prev, member];
    });
  }, []);

  // 선택된 멤버 제거
  const handleRemoveMember = useCallback(
    (id: string, type: GroupTreeNodeType) => {
      const setter =
        type === GROUP_TREE_NODE_TYPE.account
          ? setSelectedAccounts
          : setSelectedGroups;
      setter((prev) => prev.filter((item) => item.id !== id));
    },
    [],
  );

  // 취소
  const handleCancel = () => {
    resetToInitial();
    onClose();
  };

  // 확인 - 평탄화된 멤버 데이터 전달
  const handleConfirm = () => {
    const members = flattenSelectedMembers(
      selectedAccounts,
      selectedGroups,
      treeData,
    );
    onConfirm(members);
    onClose();
  };

  // 그룹 버튼
  const GroupButton = useCallback(
    ({ id, name }: GroupTreeButtonProps) => {
      const isActive = selectedGroups.some((item) => item.id === id);
      const node = nodeMap.get(id);

      return (
        <FileTreeButton
          isActive={isActive}
          onClick={() => node && handleSelectNode(node)}
        >
          {name}
        </FileTreeButton>
      );
    },
    [selectedGroups, nodeMap, handleSelectNode],
  );

  // 계정 버튼
  const AccountButton = useCallback(
    ({ id, name }: GroupTreeButtonProps) => {
      const isActive = selectedAccounts.some((item) => item.id === id);
      const node = nodeMap.get(id);

      return (
        <FileTreeButton
          isActive={isActive}
          onClick={() => node && handleSelectNode(node)}
          icon={{ visible: true, name: "Person", color: "#000", size: 16 }}
        >
          {name}
        </FileTreeButton>
      );
    },
    [selectedAccounts, nodeMap, handleSelectNode],
  );

  if (!open) return null;

  return (
    <Modal
      type="primary"
      icon={<Icon name="Person" color="#fff" size={18} />}
      modalWidth={580}
      open={open}
      closable
      title={title}
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="확인"
      onOk={handleConfirm}
      centered
      showHeaderBorder
      loading={isLoading}
    >
      <Body>
        <Content>
          <LeftColumn>
            <SectionHeader>그룹 목록</SectionHeader>
            <SearchRow>
              <SearchInput
                width="100%"
                placeholder="계정 이름 또는 그룹 이름을 입력해 주세요."
              />
            </SearchRow>
            <TreeContainer>
              <RootRow>
                <RootIconWrapper>
                  <Icon name="FormatListBulleted" size={20} color="#fff" />
                </RootIconWrapper>
                <RootLabel>전체</RootLabel>
              </RootRow>
              <GroupTree
                treeData={treeData}
                groupButton={GroupButton}
                accountButton={AccountButton}
              />
            </TreeContainer>
          </LeftColumn>

          <RightColumn>
            <SectionHeaderRow>
              <SectionTitle>선택된 계정</SectionTitle>
              <SectionSummary>총 {selectedAccounts.length}명</SectionSummary>
            </SectionHeaderRow>
            <SelectedBox>
              {selectedAccounts.length === 0 ? (
                <EmptyText>선택된 계정이 없습니다.</EmptyText>
              ) : (
                <SelectedList>
                  {selectedAccounts.map((account) => (
                    <SelectedItem key={account.id}>
                      <SelectedItemContent>
                        <SelectedItemName>{account.name}</SelectedItemName>
                        {account.email && (
                          <SelectedItemSubName>
                            {account.email}
                          </SelectedItemSubName>
                        )}
                      </SelectedItemContent>
                      <Button
                        icon="Delete"
                        onClick={() =>
                          handleRemoveMember(
                            account.id,
                            GROUP_TREE_NODE_TYPE.account,
                          )
                        }
                      />
                    </SelectedItem>
                  ))}
                </SelectedList>
              )}
            </SelectedBox>

            <SectionBlock>
              <SectionHeaderRow>
                <SectionTitle>선택된 그룹</SectionTitle>
                <SectionSummary>총 {selectedGroups.length}그룹</SectionSummary>
              </SectionHeaderRow>
              <SelectedBox>
                {selectedGroups.length === 0 ? (
                  <EmptyText>선택된 그룹이 없습니다.</EmptyText>
                ) : (
                  <SelectedList>
                    {selectedGroups.map((group) => {
                      const node = nodeMap.get(group.id);
                      const count = node ? countAccountsInGroup(node) : 0;

                      return (
                        <SelectedItem key={group.id}>
                          <SelectedItemContent>
                            <SelectedItemName>{group.name}</SelectedItemName>
                            <SelectedItemSubName>{count}명</SelectedItemSubName>
                          </SelectedItemContent>
                          <Button
                            icon="Delete"
                            onClick={() =>
                              handleRemoveMember(
                                group.id,
                                GROUP_TREE_NODE_TYPE.group,
                              )
                            }
                          />
                        </SelectedItem>
                      );
                    })}
                  </SelectedList>
                )}
              </SelectedBox>
            </SectionBlock>
          </RightColumn>
        </Content>
      </Body>
    </Modal>
  );
}

// ===== Styled Components =====

const Body = styled.div`
  padding: 0px 4px;
`;

const SearchRow = styled.div`
  margin-bottom: 4px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const LeftColumn = styled.div`
  width: 275px;
  display: flex;
  flex-direction: column;
`;

const RightColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionHeader = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #000;
  margin-bottom: 8px;
`;

const SectionHeaderRow = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 6px;
  align-items: center;
  margin-bottom: 4px;
`;

const SectionTitle = styled.div`
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  color: #000;
`;

const SectionSummary = styled.div`
  font-size: 11px;
  color: #000;
`;

const SectionBlock = styled.div`
  margin-top: 8px;
`;

const TreeContainer = styled.div`
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  background-color: #ffffff;
  height: 272px;
  padding: 16px 14px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  > div:not(:first-child) {
    flex: 1;
    min-height: 0;
    overflow: visible;
  }
`;

const SelectedBox = styled.div`
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  height: 136px;
  padding: 8px 12px;
  overflow-y: auto;
  background-color: #fff;
`;

const EmptyText = styled.div`
  font-size: 12px;
  color: #828588;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const RootRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const RootIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 2px;
  background-color: #37455e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
`;

const RootLabel = styled.div`
  font-size: 12px;
  line-height: 24px;
  color: #000;
`;

const SelectedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SelectedItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 4px 4px;
  border-bottom: 1px solid #f1f1f1;
`;

const SelectedItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  margin-right: 4px;
`;

const SelectedItemName = styled.span`
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: #000;
  white-space: nowrap;
`;

const SelectedItemSubName = styled.span`
  font-size: 12px;
  line-height: 16px;
  color: #444;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
