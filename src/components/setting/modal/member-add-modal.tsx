"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import styled from "styled-components";
import { Button, Checkbox, Icon, Input, Modal } from "xiilab-ui";

import {
  closeMemberAddModalAtom,
  memberAddModalOpenAtom,
} from "@/atoms/setting/setting-modal.atom";
import { EmptyState } from "@/components/common/empty-state/empty-state";

interface OrganizationMember {
  key: string;
  name: string;
  email: string;
  title?: string;
}

interface SelectedMember extends OrganizationMember {
  // 선택된 멤버 추가 정보
}

interface SelectedGroup {
  key: string;
  name: string;
  memberCount?: number;
}

interface TreeNode {
  title: string;
  key: string;
  icon?: React.ReactNode;
  isLeaf?: boolean;
  checkable?: boolean;
  children?: TreeNode[];
  memberData?: {
    name: string;
    email: string;
    title: string;
  };
  groupData?: {
    name: string;
    memberCount: number;
  };
  fileData?: {
    name: string;
    type: string;
  };
}

interface CustomTreeItemProps {
  data: TreeNode;
  expandedKeys: Set<string>;
  checkedKeys: Set<string>;
  onExpand: (key: string) => void;
  onCheck: (key: string, checked: boolean) => void;
  onSelect: (node: TreeNode) => void;
}

/**
 * 커스텀 트리 아이템 컴포넌트
 */
function CustomTreeItem({
  data,
  expandedKeys,
  checkedKeys,
  onExpand,
  onCheck,
  onSelect,
}: CustomTreeItemProps) {
  const isExpanded = expandedKeys.has(data.key);
  const isChecked = checkedKeys.has(data.key);
  const hasChildren = data.children && data.children.length > 0;

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onExpand(data.key);
    }
  };

  const handleToggleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.key !== "0-0") {
      // 전체 노드는 체크 불가
      onCheck(data.key, !isChecked);
    }
  };

  return (
    <TreeItemContainer>
      <TreeItemContent>
        {/* 전체 노드는 List 아이콘 고정, 다른 노드는 caret, 멤버 노드는 작은 간격만 */}
        {data.key === "0-0" ? (
          <ExpandButton onClick={handleToggleExpand}>
            <ListIconWrapper>
              <Icon name="FormatListBulleted" size={16} color="#ffffff" />
            </ListIconWrapper>
          </ExpandButton>
        ) : hasChildren ? (
          <ExpandButton onClick={handleToggleExpand}>
            {isExpanded ? (
              <Icon name="CaretOpen" size={24} color="#666" />
            ) : (
              <Icon name="CaretDown" size={24} color="#666" />
            )}
          </ExpandButton>
        ) : null}

        {/* 체크박스 (전체 노드 제외) */}
        {data.key !== "0-0" && (
          <CheckboxContainer>
            <Checkbox
              checked={isChecked}
              onChange={(e) => handleToggleCheck(e as any)}
              size="small"
            />
          </CheckboxContainer>
        )}

        {/* 제목 */}
        <TitleContainer>
          <span>{data.title}</span>
        </TitleContainer>
      </TreeItemContent>

      {/* 자식 노드들 */}
      {hasChildren && isExpanded && (
        <ChildrenContainer>
          {data.children?.map((child) => (
            <CustomTreeItem
              key={child.key}
              data={child}
              expandedKeys={expandedKeys}
              checkedKeys={checkedKeys}
              onExpand={onExpand}
              onCheck={onCheck}
              onSelect={onSelect}
            />
          ))}
        </ChildrenContainer>
      )}
    </TreeItemContainer>
  );
}

/**
 * 멤버추가 모달 컴포넌트
 *
 * 조직도 Tree에서 멤버를 선택하여 워크스페이스에 추가할 수 있는 모달입니다.
 */
function MemberAddModal() {
  const isVisible = useAtomValue(memberAddModalOpenAtom);
  const closeModal = useSetAtom(closeMemberAddModalAtom);

  // 선택된 멤버들 상태
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
  // 선택된 그룹들 상태
  const [selectedGroups, setSelectedGroups] = useState<SelectedGroup[]>([]);
  // 검색어 상태
  const [searchValue, setSearchValue] = useState("");
  // 펼쳐진 노드 키들 상태 (Set으로 관리)
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
    new Set([
      "0-0", // 전체
      "0-0-0", // 경영관리팀
      "0-0-1", // 서비스 개발
      "0-0-1-0", // 서비스 개발 > 백엔드팀
      "0-0-1-0-0", // 서비스 개발 > 백엔드팀 > API 개발팀
      "0-0-1-1", // 서비스 개발 > 프론트엔드팀
      "0-0-2", // Product Design팀
    ]),
  );
  // 체크된 노드 키들 상태 (Set으로 관리)
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());

  // 조직도 데모 데이터
  const organizationTreeData: TreeNode[] = [
    {
      title: "전체",
      key: "0-0",
      children: [
        {
          title: "경영관리팀",
          key: "0-0-0",
          groupData: {
            name: "경영관리팀",
            memberCount: 8,
          },
          children: [
            {
              title: "아무개 (sb.lee@xilab.com)",
              key: "0-0-0-0",
              isLeaf: true,
              memberData: {
                name: "아무개",
                email: "sb.lee@xilab.com",
                title: "아무개",
              },
            },
            {
              title: "아무개 (sb.lee@xilab.com)",
              key: "0-0-0-1",
              isLeaf: true,
              memberData: {
                name: "아무개",
                email: "sb.lee@xilab.com",
                title: "아무개",
              },
            },
            {
              title: "아무개 (sb.lee@xilab.com)",
              key: "0-0-0-2",
              isLeaf: true,
              memberData: {
                name: "아무개",
                email: "sb.lee@xilab.com",
                title: "아무개",
              },
            },
          ],
        },
        {
          title: "서비스 개발",
          key: "0-0-1",
          groupData: {
            name: "서비스 개발",
            memberCount: 12,
          },
          children: [
            {
              title: "백엔드팀",
              key: "0-0-1-0",
              groupData: {
                name: "백엔드팀",
                memberCount: 6,
              },
              children: [
                {
                  title: "API 개발팀",
                  key: "0-0-1-0-0",
                  groupData: {
                    name: "API 개발팀",
                    memberCount: 3,
                  },
                  children: [
                    {
                      title: "김개발 (kim.dev@xilab.com)",
                      key: "0-0-1-0-0-0",
                      isLeaf: true,
                      memberData: {
                        name: "김개발",
                        email: "kim.dev@xilab.com",
                        title: "김개발",
                      },
                    },
                  ],
                },
                {
                  title: "박백엔드 (park.backend@xilab.com)",
                  key: "0-0-1-0-1",
                  isLeaf: true,
                  memberData: {
                    name: "박백엔드",
                    email: "park.backend@xilab.com",
                    title: "박백엔드",
                  },
                },
              ],
            },
            {
              title: "프론트엔드팀",
              key: "0-0-1-1",
              groupData: {
                name: "프론트엔드팀",
                memberCount: 6,
              },
              children: [
                {
                  title: "이프론트 (lee.front@xilab.com)",
                  key: "0-0-1-1-0",
                  isLeaf: true,
                  memberData: {
                    name: "이프론트",
                    email: "lee.front@xilab.com",
                    title: "이프론트",
                  },
                },
                {
                  title: "최리액트 (choi.react@xilab.com)",
                  key: "0-0-1-1-1",
                  isLeaf: true,
                  memberData: {
                    name: "최리액트",
                    email: "choi.react@xilab.com",
                    title: "최리액트",
                  },
                },
              ],
            },
          ],
        },
        {
          title: "Product Design팀",
          key: "0-0-2",
          groupData: {
            name: "Product Design팀",
            memberCount: 5,
          },
          children: [
            {
              title: "아무개 (sb.lee@xilab.com)",
              key: "0-0-2-0",
              isLeaf: true,
              memberData: {
                name: "아무개",
                email: "sb.lee@xilab.com",
                title: "아무개",
              },
            },
            {
              title: "방성준 (se.bang@xilab.com)",
              key: "0-0-2-1",
              isLeaf: true,
              memberData: {
                name: "방성준",
                email: "se.bang@xilab.com",
                title: "방성준",
              },
            },
            {
              title: "손지윤 (jiyoon.son@xilab.com)",
              key: "0-0-2-2",
              isLeaf: true,
              memberData: {
                name: "손지윤",
                email: "jiyoon.son@xilab.com",
                title: "손지윤",
              },
            },
            {
              title: "서경덕 (gd.seo@xilab.com)",
              key: "0-0-2-3",
              isLeaf: true,
              memberData: {
                name: "서경덕",
                email: "gd.seo@xilab.com",
                title: "서경덕",
              },
            },
            {
              title: "제이슨 (mj.je@xilab.com)",
              key: "0-0-2-4",
              isLeaf: true,
              memberData: {
                name: "제이슨",
                email: "mj.je@xilab.com",
                title: "제이슨",
              },
            },
          ],
        },
      ],
    },
  ];

  /**
   * 커스텀 트리 펼치기/접기 핸들러
   */
  const handleTreeExpand = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  /**
   * 커스텀 트리 체크박스 핸들러
   */
  // 모든 자식 노드의 키를 재귀적으로 수집하는 함수
  const getAllChildKeys = (node: TreeNode): string[] => {
    let keys: string[] = [];
    if (node.children) {
      for (const child of node.children) {
        keys.push(String(child.key));
        keys = keys.concat(getAllChildKeys(child));
      }
    }
    return keys;
  };

  // 부모 노드의 키를 찾는 함수
  const getParentKey = (
    targetKey: string,
    nodes: TreeNode[],
    parentKey?: string,
  ): string | null => {
    for (const node of nodes) {
      if (String(node.key) === targetKey) {
        return parentKey || null;
      }
      if (node.children) {
        const found = getParentKey(targetKey, node.children, String(node.key));
        if (found !== null) return found;
      }
    }
    return null;
  };

  // 형제 노드들이 모두 체크되었는지 확인하는 함수
  const areAllSiblingsChecked = (
    parentKey: string,
    checkedKeys: Set<string>,
  ): boolean => {
    const parentNode = findNodeByKey(organizationTreeData, parentKey);
    if (!parentNode || !parentNode.children) return false;

    return parentNode.children.every((child) =>
      checkedKeys.has(String(child.key)),
    );
  };

  const handleTreeCheck = (key: string, checked: boolean) => {
    setCheckedKeys((prev) => {
      const next = new Set(prev);
      const node = findNodeByKey(organizationTreeData, key);
      if (!node) return next;

      if (checked) {
        // 현재 노드 체크
        next.add(key);

        // 모든 자식 노드들도 체크
        const childKeys = getAllChildKeys(node);
        childKeys.forEach((childKey) => next.add(childKey));

        // 부모 노드 체크 여부 확인 (형제들이 모두 체크되었으면 부모도 체크) - 재귀적으로 상위까지
        let currentParentKey = getParentKey(key, organizationTreeData);
        while (
          currentParentKey &&
          areAllSiblingsChecked(currentParentKey, next)
        ) {
          next.add(currentParentKey);
          currentParentKey = getParentKey(
            currentParentKey,
            organizationTreeData,
          );
        }
      } else {
        // 현재 노드 언체크
        next.delete(key);

        // 모든 자식 노드들도 언체크
        const childKeys = getAllChildKeys(node);
        childKeys.forEach((childKey) => next.delete(childKey));

        // 부모 노드들도 언체크 - 재귀적으로 상위까지
        let currentParentKey = getParentKey(key, organizationTreeData);
        while (currentParentKey) {
          next.delete(currentParentKey);
          currentParentKey = getParentKey(
            currentParentKey,
            organizationTreeData,
          );
        }
      }

      return next;
    });

    // 체크된 노드에 따라 멤버/그룹 추가/제거
    const node = findNodeByKey(organizationTreeData, key);
    if (!node) return;

    if (checked) {
      // 체크 시 멤버/그룹 추가 (자식들도 포함)
      const processNode = (currentNode: TreeNode) => {
        if (currentNode.isLeaf && currentNode.memberData) {
          const member: SelectedMember = {
            key: String(currentNode.key),
            name: currentNode.memberData.name,
            email: currentNode.memberData.email,
            title: currentNode.memberData.title,
          };

          if (!selectedMembers.find((m) => m.key === member.key)) {
            setSelectedMembers((prev) => [...prev, member]);
          }
        } else if (!currentNode.isLeaf && currentNode.groupData) {
          const group: SelectedGroup = {
            key: String(currentNode.key),
            name: currentNode.groupData.name,
            memberCount: currentNode.groupData.memberCount,
          };

          if (!selectedGroups.find((g) => g.key === group.key)) {
            setSelectedGroups((prev) => [...prev, group]);
          }
        }

        // 자식 노드들도 처리
        if (currentNode.children) {
          currentNode.children.forEach(processNode);
        }
      };

      processNode(node);
    } else {
      // 언체크 시 멤버/그룹 제거 (자식들도 포함)
      const processNode = (currentNode: TreeNode) => {
        if (currentNode.isLeaf && currentNode.memberData) {
          setSelectedMembers((prev) =>
            prev.filter((m) => m.key !== String(currentNode.key)),
          );
        } else if (!currentNode.isLeaf && currentNode.groupData) {
          setSelectedGroups((prev) =>
            prev.filter((g) => g.key !== String(currentNode.key)),
          );
        }

        // 자식 노드들도 처리
        if (currentNode.children) {
          currentNode.children.forEach(processNode);
        }
      };

      processNode(node);
    }
  };

  /**
   * 커스텀 트리 노드 선택 핸들러
   */
  const handleTreeSelect = (node: TreeNode) => {
    // 전체 노드는 선택 방지
    if (node.key === "0-0") {
      return;
    }

    // 멤버 선택
    if (node.isLeaf && node.memberData) {
      const member: SelectedMember = {
        key: String(node.key),
        name: node.memberData.name,
        email: node.memberData.email,
        title: node.memberData.title,
      };

      // 이미 선택된 멤버인지 확인
      if (!selectedMembers.find((m) => m.key === member.key)) {
        setSelectedMembers((prev) => [...prev, member]);
      }
    }
    // 파일 선택 (파일은 선택하지 않거나 별도 처리)
    else if (node.isLeaf && node.fileData) {
      console.log("파일 선택됨:", node.fileData.name);
      // 파일은 멤버 추가 대상이 아니므로 무시하거나 별도 처리
    }
    // 그룹 선택
    else if (!node.isLeaf && node.groupData) {
      const group: SelectedGroup = {
        key: String(node.key),
        name: node.groupData.name,
        memberCount: node.groupData.memberCount,
      };

      // 이미 선택된 그룹인지 확인
      if (!selectedGroups.find((g) => g.key === group.key)) {
        setSelectedGroups((prev) => [...prev, group]);
      }
    }
  };

  /**
   * 선택된 멤버 삭제 핸들러
   */
  const handleRemoveMember = (memberKey: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.key !== memberKey));
    // 체크박스 상태도 함께 업데이트
    setCheckedKeys((prev) => {
      const next = new Set(prev);
      next.delete(memberKey);
      return next;
    });
  };

  /**
   * 선택된 그룹 삭제 핸들러
   */
  const handleRemoveGroup = (groupKey: string) => {
    setSelectedGroups((prev) => prev.filter((g) => g.key !== groupKey));
    // 체크박스 상태도 함께 업데이트
    setCheckedKeys((prev) => {
      const next = new Set(prev);
      next.delete(groupKey);
      return next;
    });
  };

  /**
   * 트리에서 키로 노드 찾기 헬퍼 함수
   */
  const findNodeByKey = (nodes: TreeNode[], key: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.key === key) {
        return node;
      }
      if (node.children) {
        const found = findNodeByKey(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  /**
   * 멤버 추가 확인 핸들러
   */
  const handleAddMembers = () => {
    if (selectedMembers.length === 0 && selectedGroups.length === 0) {
      return;
    }

    // TODO: 실제 멤버 추가 API 호출
    console.log("추가할 멤버들:", selectedMembers);
    console.log("추가할 그룹들:", selectedGroups);

    // 선택된 멤버/그룹 초기화 및 모달 닫기
    setSelectedMembers([]);
    setSelectedGroups([]);
    setCheckedKeys(new Set());
    setSearchValue("");
    closeModal();
  };

  /**
   * 모달 취소 핸들러
   */
  const handleCancel = () => {
    setSelectedMembers([]);
    setSelectedGroups([]);
    setCheckedKeys(new Set());
    setSearchValue("");
    closeModal();
  };

  return (
    <Modal
      title="워크스페이스 멤버 추가"
      open={isVisible}
      onCancel={handleCancel}
      type="primary"
      variant="custom"
      icon={<Icon name="PersonFilled" size={24} color="#FFF" />}
      modalWidth={580}
      showHeaderBorder
      centered
      footer={
        <FooterContainer>
          <Button onClick={handleCancel}>취소</Button>
          <Button
            color="primary"
            variant="gradient"
            onClick={handleAddMembers}
            disabled={
              selectedMembers.length === 0 && selectedGroups.length === 0
            }
          >
            확인
          </Button>
        </FooterContainer>
      }
    >
      <ModalContent>
        <MainContent>
          {/* 왼쪽: 그룹 목록 */}
          <LeftSection>
            <SectionTitle>그룹 목록</SectionTitle>
            <SearchContainer>
              <Input.Search
                placeholder="사용자 이름 또는 그룹 이름을 입력해 주세요."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                width="100%"
                height={32}
              />
            </SearchContainer>
            <TreeContainer>
              {organizationTreeData.map((node) => (
                <CustomTreeItem
                  key={node.key}
                  data={node}
                  expandedKeys={expandedKeys}
                  checkedKeys={checkedKeys}
                  onExpand={handleTreeExpand}
                  onCheck={handleTreeCheck}
                  onSelect={handleTreeSelect}
                />
              ))}
            </TreeContainer>
          </LeftSection>

          {/* 오른쪽: 선택된 사용자 + 선택된 그룹 */}
          <RightSection>
            {/* 선택된 사용자 영역 */}
            <SelectionSection>
              <SectionTitle>
                선택된 사용자 총 {selectedMembers.length}명
              </SectionTitle>
              <SelectionContainer>
                {selectedMembers.length === 0 ? (
                  <EmptyState
                    icon={
                      <Icon name="PersonFilled" size={24} color="#878898" />
                    }
                    title="선택된 사용자가 없습니다"
                    content="왼쪽에서 사용자를 선택해주세요"
                  />
                ) : (
                  selectedMembers.map((member) => (
                    <SelectionItem key={member.key}>
                      <SelectionInfo>
                        <SelectionName>{member.name}</SelectionName>
                        <SelectionEmail>{member.email}</SelectionEmail>
                      </SelectionInfo>
                      <RemoveButton
                        onClick={() => handleRemoveMember(member.key)}
                      >
                        <Icon name="Delete" size={16} color="#404040" />
                      </RemoveButton>
                    </SelectionItem>
                  ))
                )}
              </SelectionContainer>
            </SelectionSection>

            {/* 선택된 그룹 영역 */}
            <SelectionSection>
              <SectionTitle>
                선택된 그룹 총 {selectedGroups.length}그룹
              </SectionTitle>
              <SelectionContainer>
                {selectedGroups.length === 0 ? (
                  <div style={{ padding: "12px", flex: 1 }}>
                    <EmptyState
                      icon={<Icon name="Group02" size={24} color="#878898" />}
                      title="선택된 그룹이 없습니다"
                      content="왼쪽에서 그룹을 선택해주세요"
                    />
                  </div>
                ) : (
                  selectedGroups.map((group) => (
                    <SelectionItem key={group.key}>
                      <SelectionInfo>
                        <SelectionName>
                          {group.name} {group.memberCount}명
                        </SelectionName>
                      </SelectionInfo>
                      <RemoveButton
                        onClick={() => handleRemoveGroup(group.key)}
                      >
                        <Icon name="Delete" size={16} />
                      </RemoveButton>
                    </SelectionItem>
                  ))
                )}
              </SelectionContainer>
            </SelectionSection>
          </RightSection>
        </MainContent>
      </ModalContent>
    </Modal>
  );
}

export default MemberAddModal;

// 커스텀 트리 스타일드 컴포넌트들

const TreeItemContainer = styled.div`
  width: 100%;
  position: relative;
  min-width: max-content;
`;

const TreeItemContent = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
  position: relative;
  padding: 2px 4px;

  &:hover {
    background-color: #eef4ff;
    border-radius: 2px;
  }
`;

const ExpandButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f0f0f0;
    border-radius: 2px;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 9px;
`;

const ListIconWrapper = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 2px;
  background: #37455e;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 4px;
`;

const TitleContainer = styled.div`
  flex: 1;

  font-size: 12px;
  color: #000000;
  line-height: 20px;
  border-radius: 4px;
  white-space: nowrap;
  min-height: 20px;
  min-width: 0; /* flexbox에서 텍스트 오버플로우를 위해 필요 */
`;

const ChildrenContainer = styled.div`
  position: relative;
  padding-left: 24px;
  margin-left: 2px;

  /* 수직선 그리기 */
  &::before {
    content: "";
    position: absolute;
    left: 12px;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: #d6deee;
  }

  /* 마지막 자식의 수직선은 중간까지만 */
  & > ${TreeItemContainer}:last-child::before {
    content: "";
    position: absolute;
    left: -12px;
    top: 0;
    height: 12px;
    width: 1px;
    background-color: #d6deee;
  }

  /* 수평선 그리기 */
  & > ${TreeItemContainer}::after {
    content: "";
    position: absolute;
    left: -12px;
    top: 12px;
    width: 12px;
    height: 1px;
    background-color: #d6deee;
  }
`;

// Styled Components
const ModalContent = styled.div`
  padding: 0;
`;

const SearchContainer = styled.div`
  margin-bottom: 4px;
  width: 100%;

  .xii-input {
    width: 100% !important;
  }
`;

const MainContent = styled.div`
  display: flex;
  gap: 8px;
  height: 380px;
`;

const LeftSection = styled.div`
  width: 266px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #000000;
  margin-bottom: 4px;
`;

const TreeContainer = styled.div`
  width: 266px;
  border: 1px solid #e1e4e7;
  border-radius: 4px;
  padding: 16px 12px;
  overflow: auto;
  background: #ffffff;
  height: 320px;
  flex-shrink: 0;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const SelectionSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SelectionContainer = styled.div`
  flex: 1;
  border: 1px solid #e1e4e7;
  border-radius: 4px;
  padding: 6px 12px 12px 12px;
  overflow-y: auto;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  min-height: 120px;
`;

const SelectionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 0 4px;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: #f1f1f1;
  }
`;

const SelectionInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SelectionName = styled.div`
  font-weight: 500;
  font-size: 12px;
  color: #000000;
  line-height: 16px;
`;

const SelectionEmail = styled.div`
  font-weight: 400;
  font-size: 12px;
  color: #444444;
  line-height: 16px;
`;

const RemoveButton = styled.button`
  width: 26px;
  height: 26px;
  border: 1px solid #dcdcdc;
  border-radius: 2px;
  background: #fafafa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04);

  &:hover {
    background: #f0f0f0;
  }
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;
