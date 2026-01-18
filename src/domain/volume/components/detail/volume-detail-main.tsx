"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";
import { Icon, type TabsSeparatedItem, Typography } from "xiilab-ui";

import { useGetVolumeDetail } from "@/api/generated/volume/volume";
import { UpdateVolumeDetail } from "@/domain/volume/components/detail/update-volume-detail";
import { ViewVolumeDetail } from "@/domain/volume/components/detail/view-volume-detail";
import { ManageVolumeFile } from "@/domain/volume/components/file/manage-volume-file";
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

export function VolumeDetailMain() {
  const params = useParams<{ id: string }>();
  const volumeId = Number(params.id);
  const { data: session } = useSession();

  const [selectedTab, setSelectedTab] = useState("");
  const [mode, setMode] = useState<ViewMode>("view");

  const { data, isLoading } = useGetVolumeDetail(volumeId, {
    query: {
      enabled: !Number.isNaN(volumeId),
    },
  });

  const publish = usePublish();

  // 수정/삭제 버튼 활성화 조건: 생성자이거나 SUPER_ADMIN인 경우
  const currentAccountId = getSessionAccountId(session);
  const isSuperAdmin = checkIsSuperAdmin(session);
  const isCreator = currentAccountId === data?.creatorId;
  const canEditOrDelete = isCreator || isSuperAdmin;

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
    publish(VOLUME_EVENTS.sendDeleteVolume, [volumeId]);
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
        <ManageVolumeFile volumeId={volumeId} creatorId={data?.creatorId} />
      );
    }

    if (mode === "update") {
      return (
        <UpdateVolumeDetail
          volumeId={volumeId}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      );
    }

    return <ViewVolumeDetail data={data} isLoading={isLoading} />;
  };

  const showActionButtons =
    selectedTab === "" && mode === "view" && canEditOrDelete;

  return (
    <StyledAsideDetailContainer>
      <StyledAsideDetailHeader>
        <AsideDetailHeaderTitle>볼륨 상세 정보</AsideDetailHeaderTitle>
        {/* 상세 정보 페이지에서만 수정/삭제 버튼 표시, 나머지 페이지에서는 볼륨 이름 표시 */}
        {showActionButtons ? (
          <Icons>
            <IconWrapper
              type="button"
              className="icon-button"
              onClick={handleEdit}
            >
              <Icon name="Edit02" color="#000" />
              <span className="sr-only">볼륨 수정</span>
            </IconWrapper>
            <IconWrapper
              type="button"
              className="icon-button"
              onClick={handleDelete}
            >
              <Icon name="Delete" color="#000" />
              <span className="sr-only">볼륨 삭제</span>
            </IconWrapper>
          </Icons>
        ) : (
          selectedTab !== "" && (
            <Typography.Text variant="body-1-3" color="#777">
              {data?.volumeName || "-"}
            </Typography.Text>
          )
        )}
      </StyledAsideDetailHeader>
      <div style={{ marginBottom: 16 }}>
        <StateTab
          items={TAB_ITEMS}
          selectedKey={selectedTab}
          setSelectedKey={setSelectedTab}
        />
      </div>
      {renderContent()}
    </StyledAsideDetailContainer>
  );
}

const StyledAsideDetailContainer = styled(AsideDetailContainer)`
  padding: 19px 24px 20px 24px;
`;

const StyledAsideDetailHeader = styled(AsideDetailHeader)`
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
