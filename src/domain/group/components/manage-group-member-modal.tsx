"use client";

import { useCallback, useState } from "react";
import styled from "styled-components";
import { Button, Icon, Modal } from "xiilab-ui";

import { useGetAllGroups } from "@/domain/group/hooks/use-get-all-groups";
import { openMemberModalAtom } from "@/domain/group/state/group.atom";
import type {
  OpenMemberModalPayload,
  SelectedMember,
} from "@/domain/group/types/group.type";
import { FileTreeButton } from "@/shared/components/button/file-tree-button";
import { SearchInput } from "@/shared/components/input/search-input";
import { GroupTree } from "@/shared/components/tree/group-tree";
import type { GroupTreeButtonProps } from "@/shared/components/tree/group-tree-node";
import { GROUP_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import {
  GROUP_TREE_NODE_TYPE,
  type GroupTreeNodeType,
  type GroupTreeType,
} from "@/shared/schemas/group-tree.schema";
import {
  countAccountsInGroup,
  findNodeById,
} from "@/shared/utils/group-tree.util";

/**
 * 그룹 멤버 추가 모달
 *
 * PubSub 패턴을 사용하여 ManageGroupModal과 상태를 공유합니다.
 */
export function ManageGroupMemberModal() {
  const { data } = useGetAllGroups();
  const treeData = data?.content ?? [];

  // 모달 상태 관리 (Jotai)
  const { open, onOpen, onClose } = useGlobalModal(openMemberModalAtom);

  // PubSub
  const publish = usePublish();

  // 모달 내부 선택 상태
  const [selectedAccounts, setSelectedAccounts] = useState<SelectedMember[]>(
    [],
  );
  const [selectedGroups, setSelectedGroups] = useState<SelectedMember[]>([]);

  // 초기값 저장 (취소 시 복원용)
  const [initialAccounts, setInitialAccounts] = useState<SelectedMember[]>([]);
  const [initialGroups, setInitialGroups] = useState<SelectedMember[]>([]);

  // PubSub 구독 - 멤버 모달 열기 이벤트
  useSubscribe<OpenMemberModalPayload>(
    GROUP_EVENTS.openMemberModal,
    (payload) => {
      setSelectedAccounts(payload.selectedAccounts);
      setSelectedGroups(payload.selectedGroups);
      // 초기값 저장
      setInitialAccounts(payload.selectedAccounts);
      setInitialGroups(payload.selectedGroups);
      onOpen();
    },
  );

  /**
   * 트리에서 노드 선택/해제 처리
   */
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

    if (isAccount) {
      setSelectedAccounts((prev) => {
        const exists = prev.some((item) => item.id === node.id);
        if (exists) {
          return prev.filter((item) => item.id !== node.id);
        }
        return [...prev, member];
      });
    } else {
      setSelectedGroups((prev) => {
        const exists = prev.some((item) => item.id === node.id);
        if (exists) {
          return prev.filter((item) => item.id !== node.id);
        }
        return [...prev, member];
      });
    }
  }, []);

  /**
   * 선택된 멤버 제거
   */
  const handleRemoveMember = useCallback(
    (id: string, type: GroupTreeNodeType) => {
      if (type === GROUP_TREE_NODE_TYPE.account) {
        setSelectedAccounts((prev) => prev.filter((item) => item.id !== id));
      } else {
        setSelectedGroups((prev) => prev.filter((item) => item.id !== id));
      }
    },
    [],
  );

  /**
   * 취소 - 초기값으로 복원하고 모달 닫기
   */
  const handleCancel = () => {
    setSelectedAccounts(initialAccounts);
    setSelectedGroups(initialGroups);
    onClose();
  };

  /**
   * 확인 - 선택된 멤버를 부모에 전달하고 모달 닫기
   */
  const handleConfirm = () => {
    publish(GROUP_EVENTS.confirmMemberSelection, {
      selectedAccounts,
      selectedGroups,
    });
    onClose();
  };

  /**
   * 선택된 그룹의 멤버 수 가져오기
   */
  const getGroupMemberCount = (groupId: string): number => {
    const node = findNodeById(treeData, groupId);
    return node ? countAccountsInGroup(node) : 0;
  };

  // 모달이 닫혀 있을 때는 실제로 렌더링하지 않아 트리 및 내부 UI를 언마운트
  if (!open) {
    return null;
  }

  /**
   * 그룹 버튼 컴포넌트
   */
  const MemberGroupButton = ({ id, name }: GroupTreeButtonProps) => {
    const isActive = selectedGroups.some((item) => item.id === id);
    const node = findNodeById(treeData, id);

    return (
      <FileTreeButton
        isActive={isActive}
        onClick={() => node && handleSelectNode(node)}
      >
        {name}
      </FileTreeButton>
    );
  };

  /**
   * 계정 버튼 컴포넌트
   */
  const MemberAccountButton = ({ id, name }: GroupTreeButtonProps) => {
    const isActive = selectedAccounts.some((item) => item.id === id);
    const node = findNodeById(treeData, id);

    return (
      <FileTreeButton
        isActive={isActive}
        onClick={() => node && handleSelectNode(node)}
        icon={{
          visible: true,
          name: "Person",
          color: "#000",
          size: 16,
        }}
      >
        {name}
      </FileTreeButton>
    );
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="Person" color="#fff" size={18} />}
      modalWidth={580}
      open={open}
      closable
      title="멤버 추가"
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="확인"
      onOk={handleConfirm}
      centered
      showHeaderBorder
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
                groupButton={MemberGroupButton}
                accountButton={MemberAccountButton}
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
                          <SelectedItemSubName>{account.email}</SelectedItemSubName>
                        )}
                      </SelectedItemContent>
                      <Button
                        icon="Delete"
                        onClick={() =>
                          handleRemoveMember(account.id, GROUP_TREE_NODE_TYPE.account)
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
                    {selectedGroups.map((group) => (
                      <SelectedItem key={group.id}>
                        <SelectedItemContent>
                          <SelectedItemName>{group.name}</SelectedItemName>
                          <SelectedItemSubName>
                            {getGroupMemberCount(group.id)}명
                          </SelectedItemSubName>
                        </SelectedItemContent>
                        <Button
                          icon="Delete"
                          onClick={() => handleRemoveMember(group.id, GROUP_TREE_NODE_TYPE.group)}
                        />
                      </SelectedItem>
                    ))}
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

// ============================================================================
// Styled Components
// ============================================================================

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
  border-bottom: 1px solid #F1F1F1;

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
