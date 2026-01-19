"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import styled from "styled-components";
import { Button, Typography } from "xiilab-ui";

import { DeleteGroupModal } from "@/domain/group/components/delete-group-modal";
import {
  AccountDetailPanel,
  GroupDetailPanel,
} from "@/domain/group/components/detail-panel";
import { selectedItemAtom } from "@/domain/group/state/group.atom";
import { OPEN_GROUP_MODAL_CREATE_PAYLOAD } from "@/domain/group/types/group.type";
import { GroupTreeSelector } from "@/shared/components/group-member-selector";
import { useGroupTreeSearchState } from "@/shared/components/group-member-selector/hooks/use-group-tree-search-state";
import {
  ITEM_TYPES,
  type SelectableItem,
} from "@/shared/components/group-member-selector/types";
import { GROUP_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";

export function GroupMain() {
  const publish = usePublish();
  const searchState = useGroupTreeSearchState();
  const [selected, setSelected] = useAtom(selectedItemAtom);

  // GroupTreeSelector에 전달할 선택된 ID Set
  const selectedAccountIds =
    selected?.type === ITEM_TYPES.ACCOUNT
      ? new Set([selected.id])
      : new Set<string>();
  const selectedGroupIds =
    selected?.type === ITEM_TYPES.GROUP
      ? new Set([selected.id])
      : new Set<string>();

  const handleCreateGroup = () => {
    publish(GROUP_EVENTS.openGroupModal, OPEN_GROUP_MODAL_CREATE_PAYLOAD);
  };

  /**
   * 트리에서 항목 선택 시 호출되는 핸들러
   */
  const handleSelectMember = (item: SelectableItem) => {
    if (item.type === ITEM_TYPES.ACCOUNT) {
      setSelected({ id: item.data.accountId, type: ITEM_TYPES.ACCOUNT });
    } else {
      setSelected({ id: item.data.groupId, type: ITEM_TYPES.GROUP });
    }
  };

  /**
   * 오른쪽 패널 렌더링
   */
  const renderDetailPanel = () => {
    // 선택 없음
    if (!selected) {
      return (
        <EmptyPanel>
          <EmptyMessage>그룹 또는 계정을 선택해주세요.</EmptyMessage>
        </EmptyPanel>
      );
    }

    if (selected.type === ITEM_TYPES.GROUP) {
      return <GroupDetailPanel groupId={selected.id} />;
    }

    return <AccountDetailPanel accountId={selected.id} />;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: 초기 마운트 시 선택 상태 초기화
  useEffect(() => {
    setSelected(null);
  }, []);

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
            <LeftCard>
              <Typography.Text variant="subtitle-2-1">
                그룹 목록
              </Typography.Text>
              <LeftTreeContent>
                <GroupTreeSelector
                  selectedAccountIds={selectedAccountIds}
                  selectedGroupIds={selectedGroupIds}
                  onSelectMember={handleSelectMember}
                  searchState={searchState}
                />
              </LeftTreeContent>
            </LeftCard>
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #FAFAFA;
`;

const LeftCard = styled.div`
  flex: 1;
  min-height: 0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* GroupTreeSelector 내부 트리 박스 스타일을 화면별로 오버라이드 */
  --group-tree-border: none;
  --group-tree-border-radius: 0;
  --group-tree-background-color: transparent;
  --group-tree-padding: 0;
  --group-tree-search-margin-bottom: 12px;
`;

const LeftTreeContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  margin-top: 14px;
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
