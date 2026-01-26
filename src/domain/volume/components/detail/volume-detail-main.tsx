"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";
import { Icon, type TabsSeparatedItem, Typography } from "xiilab-ui";

import { UpdateVolumeDetail } from "@/domain/volume/components/detail/update-volume-detail";
import { ViewVolumeDetail } from "@/domain/volume/components/detail/view-volume-detail";
import { ManageVolumeFile } from "@/domain/volume/components/file/manage-volume-file";
import { useGetVolumeDetailByMode } from "@/domain/volume/hooks/use-get-volume-detail-by-mode";
import type { VolumeMode } from "@/domain/volume/types/volume.type";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { StateTab } from "@/shared/components/tab";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
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

const TAB_ITEMS: TabsSeparatedItem[] = [
  {
    key: "",
    label: "상세정보",
    icon: "Information",
  },
  {
    key: "file",
    label: "파일 목록",
    icon: "Folder",
  },
];

type ViewMode = "view" | "update";

interface VolumeDetailMainProps {
  mode: VolumeMode;
}

export function VolumeDetailMain({ mode }: VolumeDetailMainProps) {
  const params = useParams<{ id: string }>();
  const volumeId = Number(params.id);
  const { data: session } = useSession();

  const [selectedTab, setSelectedTab] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("view");

  const { data, isLoading } = useGetVolumeDetailByMode(mode, volumeId, {
    query: {
      enabled: !Number.isNaN(volumeId),
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
    publish(VOLUME_EVENTS.openDeleteModal, [volumeId]);
  };

  if (!params.id || Number.isNaN(volumeId)) {
    return (
      <AsideDetailContainer>
        <EmptyState title="유효하지 않은 볼륨 ID입니다." />
      </AsideDetailContainer>
    );
  }

  const renderContent = () => {
    if (selectedTab === "file") {
      return (
        <ManageVolumeFile
          volumeId={volumeId}
          creatorId={data?.creatorId}
          mode={mode}
        />
      );
    }

    if (viewMode === "update") {
      return (
        <UpdateVolumeDetail
          mode={mode}
          volumeId={volumeId}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      );
    }

    return <ViewVolumeDetail data={data} isLoading={isLoading} />;
  };

  const showEditButton = selectedTab === "" && viewMode === "view" && canEdit;
  const showDeleteButton =
    selectedTab === "" && viewMode === "view" && canDelete;

  return (
    <StyledAsideDetailContainer>
      <StyledAsideDetailHeader>
        <AsideDetailHeaderTitle>볼륨 상세 정보</AsideDetailHeaderTitle>
        {/* 상세 정보 페이지에서만 수정/삭제 버튼 표시, 나머지 페이지에서는 볼륨 이름 표시 */}
        {(showEditButton || showDeleteButton) && (
          <Icons>
            {showEditButton && (
              <IconWrapper
                type="button"
                className="icon-button"
                onClick={handleEdit}
              >
                <Icon name="Edit02" color="#000" />
                <span className="sr-only">볼륨 수정</span>
              </IconWrapper>
            )}
            {showDeleteButton && (
              <IconWrapper
                type="button"
                className="icon-button"
                onClick={handleDelete}
              >
                <Icon name="Delete" color="#000" />
                <span className="sr-only">볼륨 삭제</span>
              </IconWrapper>
            )}
          </Icons>
        )}
        {selectedTab !== "" && (
          <Typography.Text variant="body-1-3" color="#777">
            {data?.volumeName || "-"}
          </Typography.Text>
        )}
      </StyledAsideDetailHeader>
      <TabWrapper>
        <StateTab
          items={TAB_ITEMS}
          selectedKey={selectedTab}
          setSelectedKey={setSelectedTab}
        />
      </TabWrapper>
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

const TabWrapper = styled.div`
  margin-bottom: 16px;
`;
