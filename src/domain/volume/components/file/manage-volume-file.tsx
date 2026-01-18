"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";
import { Button, Typography } from "xiilab-ui";

import { CompressVolumeFileButton } from "@/domain/volume/components/file/compress-volume-file-button";
import { CreateVolumeFolderButton } from "@/domain/volume/components/file/create-volume-folder-button";
import { DeleteVolumeFileButton } from "@/domain/volume/components/file/delete-volume-file-button";
import { PreviewVolumeFile } from "@/domain/volume/components/file/preview-volume-file";
import { UnzipVolumeFileButton } from "@/domain/volume/components/file/unzip-volume-file-button";
import { VolumeFileButton } from "@/domain/volume/components/file/volume-file-button";
import { VolumeFileCheckbox } from "@/domain/volume/components/file/volume-file-checkbox";
import { useVolumeFileTree } from "@/domain/volume/hooks/use-volume-file-tree";
import { volumeFileCheckedNodesInfoAtom } from "@/domain/volume/state/volume.atom";
import { MyDropdown } from "@/shared/components/dropdown";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { MySpinner } from "@/shared/components/spinner";
import { RootCustomFileNode } from "@/shared/components/tree/custom-file-node";
import { CustomFileTree } from "@/shared/components/tree/custom-file-tree";
import { TABLE_MESSAGE } from "@/shared/constants/core.constant";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
  AsideDetailFooter,
} from "@/styles/layers/aside-detail-layers.styled";
import { customScrollbar } from "@/styles/mixins/scrollbar";

interface ManageVolumeFileProps {
  volumeId: number;
}

/**
 * ManageVolumeFile 컴포넌트
 *
 * 볼륨 파일 관리를 위한 종합적인 UI 컴포넌트입니다.
 * 파일 트리 탐색, 파일 미리보기, 보안 검사, 파일 업로드/다운로드 등의
 * 기능을 제공하며, 사용자가 볼륨 내 파일을 효율적으로 관리할 수 있도록
 * 구성되어 있습니다.
 *
 * 주요 기능:
 * - 파일 트리 구조 탐색 및 표시 (Lazy Loading)
 * - 선택된 파일의 미리보기
 * - 파일 보안 검사 및 취약점 확인
 * - 파일 업로드/다운로드 기능
 * - 체크박스를 통한 다중 파일 선택
 * - 파일별 액션 버튼 제공
 *
 * 데이터 흐름:
 * 1. useVolumeFileTree 훅을 통해 루트 경로 파일 데이터 요청
 * 2. 폴더 클릭 시 해당 경로의 하위 파일/폴더를 API로 조회
 * 3. 조회된 데이터를 기존 트리 데이터에 병합하여 계층 구조 유지
 * 4. CustomFileTree 컴포넌트를 통한 트리 구조 렌더링
 * 5. Pub/Sub 시스템을 통한 취약점 모달 제어
 *
 * @returns 볼륨 파일 관리 UI JSX 요소
 *
 * @example
 * ```tsx
 * // 볼륨 상세 페이지에서 사용
 * <ManageVolumeFile volumeId={123} />
 * ```
 */
export function ManageVolumeFile({ volumeId }: ManageVolumeFileProps) {
  // ---------------------------------------------------------------------------
  // Hooks
  // ---------------------------------------------------------------------------

  const publish = usePublish();
  const checkedNodesInfo = useAtomValue(volumeFileCheckedNodesInfoAtom);

  // 볼륨 파일 트리 Lazy Loading 훅
  // 폴더 클릭 시 해당 경로의 하위 파일/폴더를 조회하여 트리에 병합
  const { treeData, loadingPaths, loadChildren, isLoading, isError } =
    useVolumeFileTree({
      volumeId,
      enabled: !Number.isNaN(volumeId),
    });

  // ---------------------------------------------------------------------------
  // Derived State
  // ---------------------------------------------------------------------------

  /** 체크된 파일이 있는지 여부 */
  const hasCheckedFiles = checkedNodesInfo.length > 0;

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  /**
   * 파일 다운로드 핸들러
   * 체크된 파일들의 경로를 전달하여 다운로드 모달을 열어줌
   */
  const handleDownload = () => {
    if (!hasCheckedFiles) return;

    const filePaths = checkedNodesInfo.map((node) => node.path);
    publish(VOLUME_EVENTS.sendDownloadVolumeFile, {
      volumeId,
      filePaths,
    });
  };

  /**
   * 파일 업로드 핸들러
   * 업로드 모달을 열어 파일 업로드를 진행합니다.
   */
  const handleUpload = () => {
    publish(VOLUME_EVENTS.sendUploadVolumeFile, {
      volumeId,
    });
  };

  // ---------------------------------------------------------------------------
  // Render Helpers
  // ---------------------------------------------------------------------------

  /**
   * PrimaryArticleBody 내부 컨텐츠를 상태에 따라 렌더링
   * 우선순위: isLoading > isError > treeData.length === 0 > 파일 트리
   */
  const renderContent = () => {
    // 1. 로딩 중
    if (isLoading) {
      return <MySpinner />;
    }

    // 2. 에러 발생
    if (isError) {
      return <EmptyState title={TABLE_MESSAGE.ERROR} />;
    }

    // 3. 데이터 없음
    if (treeData.length === 0) {
      return <EmptyState title="파일이 없습니다." />;
    }

    // 4. 정상: 파일 트리 표시
    return (
      <CustomFileTree
        treeData={treeData}
        fileCheckbox={VolumeFileCheckbox}
        fileButton={VolumeFileButton}
        loadingPaths={loadingPaths}
        onFolderClick={loadChildren}
      />
    );
  };

  return (
    <Container>
      <Body>
        <PrimaryArticleHeader>
          <RootCustomFileNode>
            <Typography.Text variant="subtitle-2-1" color="#000">
              파일 목록 전체
            </Typography.Text>
          </RootCustomFileNode>
        </PrimaryArticleHeader>
        <PrimaryArticleBody>{renderContent()}</PrimaryArticleBody>
        {/* 선택된 파일의 내용을 미리보기로 표시 */}
        <PreviewVolumeFile treeData={treeData} />
      </Body>
      <Footer>
        <MyDropdown
          items={[
            <CreateVolumeFolderButton
              key="create-folder"
              volumeId={volumeId}
            />,
            <CompressVolumeFileButton key="compress" volumeId={volumeId} />,
            <UnzipVolumeFileButton key="unzip" volumeId={volumeId} />,
            <DeleteVolumeFileButton key="delete" volumeId={volumeId} />,
          ]}
        >
          <Button
            width={30}
            height={30}
            variant="outlined"
            icon="MoreHorizonal"
          ></Button>
        </MyDropdown>
        <FooterRight>
          {/* 파일 다운로드 버튼 */}
          <Button
            color="primary"
            variant="gradient"
            icon="Download"
            width={100}
            height={30}
            onClick={handleDownload}
            disabled={!hasCheckedFiles}
          >
            다운로드
          </Button>
          {/* 파일 업로드 버튼 */}
          <Button
            color="primary"
            variant="gradient"
            icon="Upload"
            width={100}
            height={30}
            onClick={handleUpload}
          >
            파일 업로드
          </Button>
        </FooterRight>
      </Footer>
    </Container>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

/**
 * 메인 파일 트리 아티클 컨테이너
 * 파일 트리를 표시하는 메인 영역
 * 스크롤 가능하고 유연한 높이를 가짐
 */
const Body = styled(AsideDetailArticle)`
  flex: 1;
  overflow: hidden;
  padding: 14px 12px;
  overflow-y: auto;
  border: 1px solid #D1D5DC;
  background-color: #F7F8FA;
  max-height: 530px;
  display: flex;
  flex-direction: column;
`;

/**
 * 파일 목록 헤더 컨테이너
 * 파일 목록 전체 제목을 표시하는 영역
 */
const PrimaryArticleHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 34px;
  padding-bottom: 10px;
`;

const PrimaryArticleBody = styled(AsideDetailArticleBody)`
  flex: 1;
  overflow: hidden;
  padding: 9px 2px;
  overflow-y: auto;
  border: 1px solid #E9EBEE;
  background-color: #fff;
  border-radius: 4px;

  ${customScrollbar()}
`;

const Footer = styled(AsideDetailFooter)`
  height: 30px;
`;

/**
 * 하단 버튼 그룹 컨테이너
 * 우측 정렬된 액션 버튼들을 배치
 */
const FooterRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  flex: 1;
`;
