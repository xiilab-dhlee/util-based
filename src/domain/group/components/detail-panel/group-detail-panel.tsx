"use client";

import styled from "styled-components";
import { Button, Typography } from "xiilab-ui";

import { useGetGroupDetail } from "@/api/generated/group/group";
import {
  createOpenGroupModalUpdatePayload,
  type OpenGroupModalCreatePayload,
} from "@/domain/group/types/group.type";
import { createMemberColumn } from "@/shared/components/column/create-member-column";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { MODAL_MODES } from "@/shared/constants/core.constant";
import { GROUP_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
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
} from "@/styles/layers/aside-detail-layers.styled";

interface GroupDetailPanelProps {
  /** 선택된 그룹 ID */
  groupId: string;
}

export function GroupDetailPanel({ groupId }: GroupDetailPanelProps) {
  const publish = usePublish();

  const {
    data: groupDetail,
    isLoading,
    isError,
  } = useGetGroupDetail(groupId, {
    query: {
      enabled: Boolean(groupId),
    },
  });

  const handleAddSubGroup = () => {
    const payload: OpenGroupModalCreatePayload = {
      mode: MODAL_MODES.CREATE,
      isSubGroup: true,
    };
    publish(GROUP_EVENTS.openGroupModal, payload);
  };

  const handleEditClick = () => {
    publish(
      GROUP_EVENTS.openGroupModal,
      createOpenGroupModalUpdatePayload(groupId),
    );
  };

  if (isError) {
    return (
      <PanelContainer>
        <AsideDetailHeader>
          <Typography.Text variant="subtitle-2-1">그룹 정보</Typography.Text>
        </AsideDetailHeader>
        <FullWrapper>
          <DataErrorState />
        </FullWrapper>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer>
      <AsideDetailHeader>
        <Typography.Text variant="subtitle-2-1">그룹 정보</Typography.Text>
      </AsideDetailHeader>

      <PanelBody>
        <AsideDetailArticle>
          <AsideDetailArticleHeader>
            <AsideDetailArticleTitle>기본 정보</AsideDetailArticleTitle>
          </AsideDetailArticleHeader>
          <AsideDetailArticleBody>
            <AsideDetailArticleItem>
              <DetailColumn>
                <AsideDetailArticleKey>그룹 이름</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {groupDetail?.groupName || "-"}
                </AsideDetailArticleValue>
              </DetailColumn>
              <DetailColumn>
                <AsideDetailArticleKey>그룹 설명</AsideDetailArticleKey>
                <DescriptionValue>
                  {groupDetail?.description || "-"}
                </DescriptionValue>
              </DetailColumn>
            </AsideDetailArticleItem>
            <AsideDetailArticleItem>
              <DetailColumn>
                <AsideDetailArticleKey>생성자</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {groupDetail?.creatorName || "-"}
                </AsideDetailArticleValue>
              </DetailColumn>
              <DetailColumn>
                <AsideDetailArticleKey>생성일</AsideDetailArticleKey>
                <AsideDetailArticleValue>
                  {formatDateSafely(groupDetail?.createdAt)}
                </AsideDetailArticleValue>
              </DetailColumn>
              <MemberColumn>
                <AsideDetailArticleKey>멤버</AsideDetailArticleKey>
                <MemberTableValue>
                  <MemberTableWrapper>
                    <CustomizedTable
                      columns={createMemberColumn()}
                      data={groupDetail?.users ?? []}
                      pagination={false}
                      activePadding
                      columnHeight={32}
                      headerHeight={32}
                      rowKey="accountId"
                      loading={isLoading}
                    />
                  </MemberTableWrapper>
                </MemberTableValue>
              </MemberColumn>
            </AsideDetailArticleItem>
          </AsideDetailArticleBody>
        </AsideDetailArticle>
      </PanelBody>
      <AsideDetailFooter>
        <div />
        <ButtonGroup>
          <Button
            variant="outlined"
            width={110}
            height={34}
            onClick={handleAddSubGroup}
            disabled={isLoading || isError}
          >
            하위 그룹 추가
          </Button>
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
            onClick={() => publish(GROUP_EVENTS.sendDeleteGroup, groupId)}
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
  background-color: #FAFAFA;
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

const DetailColumn = styled(AsideDetailArticleColumn)`
  align-items: flex-start;
`;

const DescriptionValue = styled(AsideDetailArticleValue)`
  white-space: pre-wrap;
`;

const MemberTableValue = styled(AsideDetailArticleValue)`
  min-width: 0;
  overflow: hidden;
`;

const MemberTableWrapper = styled.div`
  height: 350px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const FullWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
