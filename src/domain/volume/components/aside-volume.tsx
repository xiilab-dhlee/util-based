"use client";

import { useAtomValue } from "jotai";
import { useState } from "react";
import styled from "styled-components";
import { Icon, type TabsSeparatedItem, Typography } from "xiilab-ui";

import { ManageVolumeFile } from "@/domain/volume/components/file/manage-volume-file";
import { UpdateVolume } from "@/domain/volume/components/update-volume";
import { useGetVolume } from "@/domain/volume/hooks/use-get-volume";
import { volumeSelectedAtom } from "@/domain/volume/state/volume.atom";
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
 * AsideVolume 컴포넌트
 *
 * 볼륨 상세 정보를 사이드바에 탭 형태로 표시하는 컴포넌트입니다.
 * 볼륨의 기본 정보, 파일 관리, 보안 설정 등을 탭으로 구분하여 제공하며,
 * 각 탭에 따라 적절한 하위 컴포넌트를 렌더링합니다.
 *
 * 주요 기능:
 * - 볼륨 기본 정보 헤더 표시 (아이콘 및 이름)
 * - 탭 기반 네비게이션 (기본 정보, 파일 관리, 보안 등)
 * - 선택된 탭에 따른 동적 콘텐츠 렌더링
 * - 볼륨 정보 수정, 파일 관리, 보안 관리 컴포넌트 통합
 * - 상태 기반 탭 전환 및 콘텐츠 업데이트
 *
 * 탭 구성:
 * - 기본 정보: 볼륨 상세 정보 및 수정 기능
 * - 파일 관리: 볼륨 내 파일 목록 및 관리
 * - 보안: 볼륨 보안 설정 및 검증 상태
 *
 * @returns 볼륨 상세 정보를 탭으로 구성한 사이드바 JSX 요소
 */
export function AsideVolume() {
  // 현재 선택된 탭 상태 관리
  const [selectedTab, setSelectedTab] = useState("");
  // 읽기 전용 여부 - true: 읽기 전용 모드, false: 수정 모드
  const [readOnly, setReadOnly] = useState(true);

  const volumeSelected = useAtomValue(volumeSelectedAtom);

  const { data } = useGetVolume(volumeSelected || "");

  const publish = usePublish();

  const handleEdit = () => {
    setReadOnly((prev) => !prev);
  };

  const handleDelete = () => {
    publish(VOLUME_EVENTS.sendDeleteVolume, [volumeSelected]);
  };

  /**
   * 선택된 탭에 따라 적절한 콘텐츠를 렌더링하는 함수
   *
   * @returns 현재 탭에 해당하는 컴포넌트
   */
  const renderContent = () => {
    if (selectedTab === "file") {
      return <ManageVolumeFile />;
    } else {
      return <UpdateVolume readOnly={readOnly} setReadOnly={setReadOnly} />;
    }
  };

  return (
    <AsideDetailContainer>
      <AsideDetailHeader>
        <AsideDetailHeaderTitle>상세 정보</AsideDetailHeaderTitle>
        {/* 상세 정보 탭일 때만 수정, 삭제 버튼 표시 */}
        {/* 파일 탭일 때는 탭 표시 */}
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
            {data?.name}
          </Typography.Text>
        )}
      </AsideDetailHeader>
      <div style={{ marginBottom: 16 }}>
        <StateTab
          items={TAB_ITEMS}
          selectedKey={selectedTab}
          setSelectedKey={setSelectedTab}
        />
      </div>
      {renderContent()}
    </AsideDetailContainer>
  );
}
const IconWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  border: 1px solid #e0e0e0;
`;

const Icons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;
