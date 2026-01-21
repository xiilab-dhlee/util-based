"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import {
  useDeleteSourceCode,
  useGetSourceCodeList,
} from "@/api/generated/source-code/source-code";
import { UpdateSourcecodeDetail } from "@/domain/sourcecode/components/detail/update-sourcecode-detail";
import { ViewSourcecodeDetail } from "@/domain/sourcecode/components/detail/view-sourcecode-detail";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { ROUTES } from "@/shared/constants/routes.constant";
import { checkIsSuperAdmin } from "@/shared/utils/auth.util";
import {
  AsideDetailContainer,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
} from "@/styles/layers/aside-detail-layers.styled";

type ViewMode = "view" | "update";

export function SourcecodeDetailMain() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const sourceCodeId = Number(params.id);
  const { data: session } = useSession();

  const [mode, setMode] = useState<ViewMode>("view");

  // 목록 API에서 현재 소스코드 데이터를 찾아서 사용
  const { data: listData, isLoading } = useGetSourceCodeList(
    {
      pageNo: 0,
      pageSize: 100,
    },
    {
      query: {
        enabled: !Number.isNaN(sourceCodeId),
      },
    },
  );

  const deleteSourceCode = useDeleteSourceCode();

  const currentSourceCode = listData?.content?.find(
    (item) => item.sourceCodeId === sourceCodeId,
  );

  // 수정/삭제 버튼 활성화 조건: 생성자이거나 SUPER_ADMIN인 경우
  const isSuperAdmin = checkIsSuperAdmin(session);
  // TODO: API에서 creatorId가 제공되면 활성화
  // const isCreator = currentAccountId === currentSourceCode?.creatorId;
  const canEditOrDelete = isSuperAdmin;

  const handleEdit = () => {
    setMode("update");
  };

  const handleCancel = () => {
    setMode("view");
  };

  const handleSuccess = () => {
    setMode("view");
  };

  const handleDelete = () => {
    if (window.confirm("소스코드를 삭제하시겠습니까?")) {
      deleteSourceCode.mutate(
        { sourceCodeId },
        {
          onSuccess: () => {
            router.replace(ROUTES.USER_SOURCECODE);
          },
        },
      );
    }
  };

  if (!params.id || Number.isNaN(sourceCodeId)) {
    return (
      <AsideDetailContainer>
        <EmptyState title="유효하지 않은 소스코드 ID입니다." />
      </AsideDetailContainer>
    );
  }

  if (isLoading) {
    return (
      <AsideDetailContainer>
        <EmptyState title="로딩 중..." />
      </AsideDetailContainer>
    );
  }

  if (!currentSourceCode) {
    return (
      <AsideDetailContainer>
        <EmptyState title="소스코드를 찾을 수 없습니다." />
      </AsideDetailContainer>
    );
  }

  const renderContent = () => {
    if (mode === "update") {
      return (
        <UpdateSourcecodeDetail
          sourceCodeId={sourceCodeId}
          data={currentSourceCode}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      );
    }

    return (
      <ViewSourcecodeDetail data={currentSourceCode} isLoading={isLoading} />
    );
  };

  const showActionButtons = mode === "view" && canEditOrDelete;

  return (
    <StyledAsideDetailContainer>
      <StyledAsideDetailHeader>
        <AsideDetailHeaderTitle>소스코드 상세 정보</AsideDetailHeaderTitle>
        {showActionButtons ? (
          <Icons>
            <IconWrapper
              type="button"
              className="icon-button"
              onClick={handleEdit}
            >
              <Icon name="Edit02" color="#000" />
              <span className="sr-only">소스코드 수정</span>
            </IconWrapper>
            <IconWrapper
              type="button"
              className="icon-button"
              onClick={handleDelete}
            >
              <Icon name="Delete" color="#000" />
              <span className="sr-only">소스코드 삭제</span>
            </IconWrapper>
          </Icons>
        ) : (
          mode === "update" && (
            <Typography.Text variant="body-1-3" color="#777">
              {currentSourceCode?.sourceCodeName || "-"}
            </Typography.Text>
          )
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
