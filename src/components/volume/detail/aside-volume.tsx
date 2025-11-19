"use client";

import { useAtomValue } from "jotai";
import { useState } from "react";
import type { TabsSeparatedItem } from "xiilab-ui";

import { volumeSelectedAtom } from "@/atoms/volume.atom";
import { AstragoIcon } from "@/components/common/icon/astrago-icon";
import { StorageIcon } from "@/components/common/icon/storage-icon";
import { StateTab } from "@/components/common/tab";
import { useGetVolume } from "@/hooks/volume/use-get-volume";
import {
  AsideDetailContainer,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
} from "@/styles/layers/aside-detail-layers.styled";
import { ManageVolumeFile } from "../file/manage-volume-file";
import { UpdateVolume } from "./update-volume";

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
  {
    key: "security",
    label: "보안 취약점 파일목록",
    icon: "Security",
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

  const volumeSelected = useAtomValue(volumeSelectedAtom);

  const { data } = useGetVolume(volumeSelected || "");

  /**
   * 선택된 탭에 따라 적절한 콘텐츠를 렌더링하는 함수
   *
   * @returns 현재 탭에 해당하는 컴포넌트
   */
  const renderContent = () => {
    if (selectedTab === "file") {
      return <ManageVolumeFile />;
    } else if (selectedTab === "security") {
      return <ManageVolumeFile />;
    } else {
      return <UpdateVolume />;
    }
  };

  return (
    <AsideDetailContainer>
      <AsideDetailHeader>
        <AsideDetailHeaderTitle>
          {data?.storageType?.toLowerCase() === "astrago" ? (
            <AstragoIcon />
          ) : data?.storageType?.toLowerCase() === "storage" ? (
            <StorageIcon />
          ) : null}
          <span>{data?.name}</span>
        </AsideDetailHeaderTitle>
      </AsideDetailHeader>
      <div style={{ marginBottom: 10 }}>
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
