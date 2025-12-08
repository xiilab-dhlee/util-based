"use client";

import { useMemo } from "react";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import { useGetGroupDetail } from "@/domain/group/hooks/use-get-group-detail";
import { createOpenGroupModalUpdatePayload } from "@/domain/group/types/group.type";
import {
  createMemberColumn,
  type MemberRow,
} from "@/shared/components/column/create-member-column";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { GROUP_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import type { GroupTreeType } from "@/shared/schemas/group-tree.schema";
import { formatDateSafely } from "@/shared/utils/date.util";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleHeader,
  AsideDetailArticleItem,
  AsideDetailArticleKey,
  AsideDetailArticleTitle,
  AsideDetailArticleValue,
  AsideDetailFooter,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
} from "@/styles/layers/aside-detail-layers.styled";

interface GroupDetailPanelProps {
  /** 선택된 그룹 노드 */
  group: GroupTreeType;
}

/**
 * 그룹 상세 정보 패널
 *
 * 선택된 그룹의 상세 정보를 표시합니다.
 * 수정 버튼 클릭 시 그룹 수정 모달을 엽니다.
 */
export function GroupDetailPanel({ group }: GroupDetailPanelProps) {
  const publish = usePublish();
  // 그룹 상세 정보
  const {
    data: groupDetail,
    isLoading,
    isError,
    refetch,
  } = useGetGroupDetail(group.id);

  const handleEditClick = () => {
    publish(
      GROUP_EVENTS.openGroupModal,
      createOpenGroupModalUpdatePayload(group.id),
    );
  };

  // 멤버 테이블 데이터
  const memberData: MemberRow[] = useMemo(
    () =>
      groupDetail?.users.map((user) => ({
        id: user.accountId,
        name: user.accountName,
        email: user.email,
      })) ?? [],
    [groupDetail?.users],
  );

  return (
    <PanelContainer>
      <AsideDetailHeader>
        <AsideDetailHeaderTitle>그룹 정보</AsideDetailHeaderTitle>
      </AsideDetailHeader>

      <PanelBody>
        {isError ? (
          <DataErrorState
            title="그룹 정보를 불러올 수 없습니다."
            onRetry={refetch}
          />
        ) : (
          <AsideDetailArticle>
            <AsideDetailArticleHeader>
              <AsideDetailArticleTitle>기본 정보</AsideDetailArticleTitle>
            </AsideDetailArticleHeader>
            <AsideDetailArticleBody>
              <AsideDetailArticleItem>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>그룹 이름</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {groupDetail?.groupName ?? "-"}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>그룹 설명</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {groupDetail?.description ?? "-"}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </AsideDetailArticleItem>
              <AsideDetailArticleItem>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>생성자</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {groupDetail?.creatorName ?? "-"}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>생성일</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {formatDateSafely(groupDetail?.createDateTime)}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
                <MemberColumn>
                  <AsideDetailArticleKey>멤버</AsideDetailArticleKey>
                  <MemberTableValue>
                    <CustomizedTable<MemberRow>
                      columns={createMemberColumn()}
                      data={memberData}
                      pagination={false}
                      activePadding
                      columnHeight={32}
                      headerHeight={32}
                      rowKey="id"
                      loading={isLoading}
                    />
                  </MemberTableValue>
                </MemberColumn>
              </AsideDetailArticleItem>
            </AsideDetailArticleBody>
          </AsideDetailArticle>
        )}
      </PanelBody>
      <AsideDetailFooter>
        <div />
        <ButtonGroup>
          <Button
            variant="outlined"
            width={80}
            height={34}
            onClick={handleEditClick}
            disabled={isLoading || isError}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            width={80}
            height={34}
            onClick={() => publish(GROUP_EVENTS.sendDeleteGroup, group.id)}
            disabled={isLoading || isError}
          >
            삭제
          </Button>
        </ButtonGroup>
      </AsideDetailFooter>
    </PanelContainer>
  );
}

// ===== Local Styled Components =====

const PanelContainer = styled.div`
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  --column-gutter-size: 20px;
`;

const PanelBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const MemberColumn = styled(AsideDetailArticleColumn)`
  align-items: flex-start;
`;

const MemberTableValue = styled(AsideDetailArticleValue)`
  min-width: 0;
  overflow: hidden;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;
