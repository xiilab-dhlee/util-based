"use client";

import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import { volumeFileTreeDataAtom } from "@/atoms/volume/volume-file.atom";
import { volumeSelectedAtom } from "@/atoms/volume/volume-list.atom";
import { MyDropdown } from "@/components/common/dropdown";
import { RootCustomFileNode } from "@/components/common/tree/custom-file-node";
import { CustomFileTree } from "@/components/common/tree/custom-file-tree";
import pubsubConstants from "@/constants/common/pubsub.constant";
import securityConstants from "@/constants/security/security.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { useGetVolumeFiles } from "@/hooks/volume/use-get-volume-files";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
  AsideDetailFooter,
} from "@/styles/layers/aside-detail-layers.styled";
import PreviewVolumeFile from "./preview-volume-file";
import VolumeCompressFileButton from "./volume-compress-file-button";
import VolumeCreateFolderButton from "./volume-create-folder-button";
import VolumeFileButton from "./volume-file-button";
import VolumeFileCheckbox from "./volume-file-checkbox";

/**
 * ManageVolumeFile 컴포넌트
 *
 * 볼륨 파일 관리를 위한 종합적인 UI 컴포넌트입니다.
 * 파일 트리 탐색, 파일 미리보기, 보안 검사, 파일 업로드/다운로드 등의
 * 기능을 제공하며, 사용자가 볼륨 내 파일을 효율적으로 관리할 수 있도록
 * 구성되어 있습니다.
 *
 * 주요 기능:
 * - 파일 트리 구조 탐색 및 표시
 * - 선택된 파일의 미리보기
 * - 파일 보안 검사 및 취약점 확인
 * - 파일 업로드/다운로드 기능
 * - 체크박스를 통한 다중 파일 선택
 * - 파일별 액션 버튼 제공
 *
 * 데이터 흐름:
 * 1. useGetWorkloadFiles 훅을 통해 파일 데이터 요청
 * 2. 받은 데이터를 Jotai atom을 통해 전역 상태로 관리
 * 3. CustomFileTree 컴포넌트를 통한 트리 구조 렌더링
 * 4. Pub/Sub 시스템을 통한 취약점 모달 제어
 *
 * @returns 볼륨 파일 관리 UI JSX 요소
 *
 * @example
 * ```tsx
 * // 볼륨 상세 페이지에서 사용
 * <ManageVolumeFile />
 * ```
 */
export function ManageVolumeFile() {
  // Pub/Sub 시스템을 통한 이벤트 발행 훅
  const publish = usePublish();

  // 볼륨 파일 트리 데이터 전역 상태 관리
  // Jotai atom을 통해 파일 트리 구조를 전역적으로 관리
  const [treeData, setTreeData] = useAtom(volumeFileTreeDataAtom);

  const volumeSelected = useAtomValue(volumeSelectedAtom);

  // 워크로드 파일 데이터 요청
  // 루트 경로(/)에서 시작하여 최대 100개의 파일 노드를 가져옴
  const { data } = useGetVolumeFiles({
    id: volumeSelected || "",
    path: "/", // 루트 경로에서 시작
  });

  /**
   * 파일 보안 검사 핸들러
   * 현재는 미구현 상태로 알림 메시지만 표시
   * TODO: 실제 보안 검사 API 연동 필요
   */
  const handleScan = () => {
    alert("검사하기 미구현");
  };

  /**
   * 취약점 확인 모달 열기 핸들러
   * Pub/Sub 시스템을 통해 취약점 데이터를 전송하고 모달을 열어줌
   * 데모 데이터를 사용하여 취약점 정보를 표시
   */
  const handleShowVulnerability = () => {
    publish(
      pubsubConstants.common.sendVulnerability,
      securityConstants.vulnerabilityDemo,
    );
  };

  /**
   * 파일 다운로드 핸들러
   * 현재는 미구현 상태로 알림 메시지만 표시
   * TODO: 실제 파일 다운로드 API 연동 필요
   */
  const handleDownload = () => {
    alert("다운로드 미구현");
  };

  /**
   * 파일 업로드 핸들러
   * 현재는 미구현 상태로 알림 메시지만 표시
   * TODO: 실제 파일 업로드 API 연동 필요
   */
  const handleUpload = () => {
    alert("업로드 미구현");
  };

  // 파일 데이터 변경 시 트리 데이터 업데이트
  // API에서 받은 파일 노드 데이터를 전역 상태로 동기화
  useEffect(() => {
    if (data?.content) {
      setTreeData(data.content);
    }
  }, [data?.content, setTreeData]);

  return (
    <>
      {/* 파일 목록 헤더 영역 */}
      <Header>
        <RootCustomFileNode>
          <HeaderTitle>파일 목록 전체</HeaderTitle>
        </RootCustomFileNode>
      </Header>

      {/* 메인 파일 트리 영역 */}
      <PrimaryArticle>
        <AsideDetailArticleBody>
          {/* 커스텀 파일 트리 컴포넌트 */}
          {/* 체크박스와 액션 버튼이 포함된 파일 탐색기 */}
          <CustomFileTree
            treeData={treeData}
            fileCheckbox={VolumeFileCheckbox}
            fileButton={VolumeFileButton}
          />
        </AsideDetailArticleBody>
      </PrimaryArticle>

      {/* 파일 미리보기 영역 */}
      {/* 선택된 파일의 내용을 미리보기로 표시 */}
      <PreviewVolumeFile />

      {/* 하단 액션 버튼 영역 */}
      <AsideDetailFooter>
        {/* 좌측 버튼 - 취소 기능 */}
        <div style={{ width: 112 }}>
          <MyDropdown
            items={[
              <VolumeCompressFileButton key="compress" />,
              <VolumeCreateFolderButton key="create-folder" />,
            ]}
          >
            <Button
              width="100%"
              variant="outlined"
              icon="MoreHorizonal"
            ></Button>
          </MyDropdown>
        </div>

        {/* 우측 버튼 그룹 - 주요 액션들 */}
        <FooterLeft>
          {/* 파일 보안 검사 버튼 */}
          <Button
            color="primary"
            variant="gradient"
            width={100}
            height={30}
            onClick={handleScan}
          >
            검사하기
          </Button>

          {/* 취약점 확인 버튼 */}
          {/* 데모 데이터를 사용하여 취약점 모달을 열어줌 */}
          <Button
            color="primary"
            variant="gradient"
            width={100}
            height={30}
            onClick={handleShowVulnerability}
          >
            취약점 확인
          </Button>

          {/* 파일 업로드 버튼 */}
          <Button
            color="primary"
            variant="gradient"
            width={100}
            height={30}
            onClick={handleUpload}
          >
            파일 업로드
          </Button>

          {/* 파일 다운로드 버튼 */}
          <Button
            color="primary"
            variant="gradient"
            width={100}
            height={30}
            onClick={handleDownload}
          >
            다운로드
          </Button>
        </FooterLeft>
      </AsideDetailFooter>
    </>
  );
}


// ============================================================================
// Styled Components
// ============================================================================

/**
 * 파일 목록 헤더 컨테이너
 * 파일 목록 전체 제목을 표시하는 영역
 */
const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 34px;
  padding-bottom: 10px;
`;

/**
 * 헤더 제목 텍스트
 * 파일 목록 전체를 나타내는 제목 스타일
 */
const HeaderTitle = styled.div`
  color: #000;
  font-size: 14px;
  font-weight: 600;
`;

/**
 * 메인 파일 트리 아티클 컨테이너
 * 파일 트리를 표시하는 메인 영역
 * 스크롤 가능하고 유연한 높이를 가짐
 */
const PrimaryArticle = styled(AsideDetailArticle)`
  flex: 1;
  margin-bottom: 10px;
  overflow: hidden;
  padding: 9px;
  overflow-y: auto;
`;

/**
 * 하단 버튼 그룹 컨테이너
 * 우측 정렬된 액션 버튼들을 배치
 */
const FooterLeft = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;
