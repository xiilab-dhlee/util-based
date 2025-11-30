"use client";

import { Button } from "xiilab-ui";

import { useGetGroupDetail } from "@/domain/group/hooks/use-get-group-detail";
import type { GroupListType } from "@/domain/group/schemas/group.schema";
import {
  createOpenGroupModalUpdatePayload,
  type OpenGroupModalPayload,
} from "@/domain/group/types/group.type";
import { GROUP_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import type { GroupTreeType } from "@/shared/schemas/group-tree.schema";
import {
  formatDateSafely,
  formatDateTimeSafely,
} from "@/shared/utils/date.util";
import {
  Article,
  ArticleBody,
  ArticleKey,
  ArticlePane,
  ArticleRecord,
  ArticleTitle,
  ArticleValue,
  PanelBody,
  PanelContainer,
  PanelFooter,
  PanelHeader,
  PanelTitle,
  Tag,
} from "./detail-panel.styled";

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
  // 그룹 상세 정보 (그룹을 하나씩 호출할 때마다 조회)
  const { data: groupDetail } = useGetGroupDetail(group.id);

  const handleEditClick = () => {
    // 상세 정보가 아직 로딩되지 않은 경우 모달을 열지 않습니다.
    if (!groupDetail) {
      return;
    }

    const groupForEdit: GroupListType = {
      id: group.id,
      name: groupDetail.groupName ?? group.name,
      // 상세 응답의 Date 타입 createDateTime을 안전하게 문자열로 포맷팅합니다.
      createdDate: formatDateTimeSafely(groupDetail.createDateTime) ?? "",
      creatorName: groupDetail.creatorName ?? null,
      description: groupDetail.description ?? null,
    };

    const payload: OpenGroupModalPayload =
      createOpenGroupModalUpdatePayload(groupForEdit);

    publish(GROUP_EVENTS.openGroupModal, payload);
  };

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>그룹 정보</PanelTitle>
      </PanelHeader>

      <PanelBody>
        <Article>
          <ArticleTitle>그룹 정보</ArticleTitle>
          <ArticleBody>
            <ArticlePane>
              <ArticleRecord>
                <ArticleKey>그룹 이름</ArticleKey>
                <ArticleValue>
                  {groupDetail?.groupName ?? group.name}
                </ArticleValue>
              </ArticleRecord>
              <ArticleRecord>
                <ArticleKey>그룹 설명</ArticleKey>
                <ArticleValue>{groupDetail?.description ?? "-"}</ArticleValue>
              </ArticleRecord>
              <ArticleRecord>
                <ArticleKey>생성자</ArticleKey>
                <ArticleValue>{groupDetail?.creatorName ?? "-"}</ArticleValue>
              </ArticleRecord>
              <ArticleRecord>
                <ArticleKey>생성일</ArticleKey>
                <ArticleValue>
                  {formatDateSafely(groupDetail?.createDateTime)}
                </ArticleValue>
              </ArticleRecord>
              <ArticleRecord>
                <ArticleKey>멤버</ArticleKey>
                <ArticleValue>
                  {groupDetail && groupDetail.users.length > 0
                    ? groupDetail.users.map((user) => (
                        <Tag key={user.accountId}>{user.accountName}</Tag>
                      ))
                    : "-"}
                </ArticleValue>
              </ArticleRecord>
            </ArticlePane>
          </ArticleBody>
        </Article>
      </PanelBody>
      <PanelFooter>
        <Button
          variant="outlined"
          width={80}
          height={34}
          onClick={handleEditClick}
        >
          수정
        </Button>
        <Button
          variant="outlined"
          width={80}
          height={34}
          onClick={() => publish(GROUP_EVENTS.sendDeleteGroup, group.id)}
        >
          삭제
        </Button>
      </PanelFooter>
    </PanelContainer>
  );
}
