"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";
import { Icon, type TabsSeparatedItem, Typography } from "xiilab-ui";

import { useGetVolumeDetail } from "@/api/generated/volume/volume";
import { ManageVolumeFile } from "@/domain/volume/components/file/manage-volume-file";
import { UpdateVolume } from "@/domain/volume/components/update-volume";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { StateTab } from "@/shared/components/tab";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
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

/**
 * Volume 상세 페이지 메인 컴포넌트
 *
 * URL 파라미터 기반으로 볼륨 상세 정보를 표시합니다.
 * Hub 패턴을 따라 URL에서 id와 name을 추출하여 사용합니다.
 */
export function VolumeDetailMain() {
  const params = useParams<{ id: string }>();
  const volumeId = Number(params.id);

  // 현재 선택된 탭 상태 관리
  const [selectedTab, setSelectedTab] = useState("");
  // 읽기 전용 여부 - true: 읽기 전용 모드, false: 수정 모드
  const [readOnly, setReadOnly] = useState(true);

  const { data } = useGetVolumeDetail(volumeId, {
    query: {
      enabled: !Number.isNaN(volumeId),
    },
  });

  const publish = usePublish();

  const handleEdit = () => {
    setReadOnly((prev) => !prev);
  };

  const handleDelete = () => {
    publish(VOLUME_EVENTS.sendDeleteVolume, [volumeId]);
  };

  // 유효하지 않은 Volume ID 체크
  if (!params.id || Number.isNaN(volumeId)) {
    return (
      <AsideDetailContainer>
        <EmptyState title="유효하지 않은 볼륨 ID입니다." />
      </AsideDetailContainer>
    );
  }

  /**
   * 선택된 탭에 따라 적절한 콘텐츠를 렌더링하는 함수
   */
  const renderContent = () => {
    if (selectedTab === "file") {
      return <ManageVolumeFile volumeId={volumeId} />;
    } else {
      return (
        <UpdateVolume
          volumeId={volumeId}
          readOnly={readOnly}
          setReadOnly={setReadOnly}
        />
      );
    }
  };

  return (
    <StyledAsideDetailContainer>
      <StyledAsideDetailHeader>
        <AsideDetailHeaderTitle>볼륨 상세 정보</AsideDetailHeaderTitle>
        {selectedTab === "" ? (
          <Icons>
            <IconWrapper
              type="button"
              className="icon-button"
              onClick={handleEdit}
            >
              <Icon name="Edit02" color="#000" />
            </IconWrapper>
            <IconWrapper
              type="button"
              className="icon-button"
              onClick={handleDelete}
            >
              <Icon name="Delete" color="#000" />
            </IconWrapper>
          </Icons>
        ) : (
          <Typography.Text variant="body-1-3" color="#777">
            {data?.volumeName || "-"}
          </Typography.Text>
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
