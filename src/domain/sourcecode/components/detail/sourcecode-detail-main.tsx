"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import { UpdateSourcecodeDetail } from "@/domain/sourcecode/components/detail/update-sourcecode-detail";
import { ViewSourcecodeDetail } from "@/domain/sourcecode/components/detail/view-sourcecode-detail";
import { useGetSourcecodeDetailByMode } from "@/domain/sourcecode/hooks/use-get-sourcecode-detail-by-mode";
import type { SourcecodeMode } from "@/domain/sourcecode/types/sourcecode.type";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { SOURCECODE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  checkIsSuperAdmin,
  getSessionAccountId,
} from "@/shared/utils/auth.util";
import {
  AsideDetailContainer,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
} from "@/styles/layers/aside-detail-layers.styled";

type ViewMode = "view" | "update";

interface SourcecodeDetailMainProps {
  mode: SourcecodeMode;
}

export function SourcecodeDetailMain({ mode }: SourcecodeDetailMainProps) {
  const params = useParams<{ id: string }>();
  const sourceCodeId = Number(params.id);
  const { data: session } = useSession();

  const [viewMode, setViewMode] = useState<ViewMode>("view");

  const { data, isLoading } = useGetSourcecodeDetailByMode(mode, sourceCodeId, {
    query: {
      enabled: !Number.isNaN(sourceCodeId),
    },
  });

  const publish = usePublish();

  // 권한 체크
  const currentAccountId = getSessionAccountId(session);
  const isSuperAdmin = checkIsSuperAdmin(session);
  const isCreator = Boolean(
    data?.creatorId && currentAccountId && currentAccountId === data.creatorId,
  );
  const isUserMode = mode === "user";

  // 수정 권한
  // - 사용자 모드: 생성자만 수정 가능
  // - 관리자 모드: SUPER_ADMIN 또는 생성자만 수정 가능
  const canEdit = isUserMode ? isCreator : isSuperAdmin || isCreator;
  // 삭제 권한
  // - 사용자 모드: 생성자만 삭제 가능
  // - 관리자 모드: 항상 삭제 가능
  const canDelete = isUserMode ? isCreator : true;

  const handleEdit = () => {
    setViewMode("update");
  };

  const handleCancel = () => {
    setViewMode("view");
  };

  const handleSuccess = () => {
    setViewMode("view");
  };

  const handleDelete = () => {
    publish(SOURCECODE_EVENTS.openDeleteModal, [sourceCodeId]);
  };

  if (!params.id || Number.isNaN(sourceCodeId)) {
    return (
      <AsideDetailContainer>
        <EmptyState title="유효하지 않은 소스코드 ID입니다." />
      </AsideDetailContainer>
    );
  }

  const renderContent = () => {
    if (viewMode === "update" && data) {
      return (
        <UpdateSourcecodeDetail
          mode={mode}
          sourceCodeId={sourceCodeId}
          data={data}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      );
    }

    return <ViewSourcecodeDetail data={data} isLoading={isLoading} />;
  };

  // data가 없으면 수정/삭제 버튼 비활성화 (상세 API 요청 실패 시)
  const showEditButton = viewMode === "view" && canEdit && !!data;
  const showDeleteButton = viewMode === "view" && canDelete && !!data;

  return (
    <StyledAsideDetailContainer>
      <StyledAsideDetailHeader>
        <AsideDetailHeaderTitle>소스코드 상세 정보</AsideDetailHeaderTitle>
        {(showEditButton || showDeleteButton) && (
          <Icons>
            {showEditButton && (
              <IconWrapper
                type="button"
                className="icon-button"
                onClick={handleEdit}
              >
                <Icon name="Edit02" color="#000" />
                <span className="sr-only">소스코드 수정</span>
              </IconWrapper>
            )}
            {showDeleteButton && (
              <IconWrapper
                type="button"
                className="icon-button"
                onClick={handleDelete}
              >
                <Icon name="Delete" color="#000" />
                <span className="sr-only">소스코드 삭제</span>
              </IconWrapper>
            )}
          </Icons>
        )}
        {viewMode === "update" && (
          <Typography.Text variant="body-1-3" color="#777" className="truncate">
            {data?.sourceCodeName || "-"}
          </Typography.Text>
        )}
      </StyledAsideDetailHeader>
      {renderContent()}
    </StyledAsideDetailContainer>
  );
}

const StyledAsideDetailContainer = styled(AsideDetailContainer)`
  padding: 19px 24px 20px 24px;
`;

const StyledAsideDetailHeader = styled(AsideDetailHeader)`
  min-height: 24px;
  margin-bottom: 12px;
  gap: 10px;
`;

const IconWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 2px;
  border: 1px solid #e0e0e0;
`;

const Icons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;
