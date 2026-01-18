"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
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
import {
  volumeFileCheckedNodesAtom,
  volumeFileCheckedNodesInfoAtom,
} from "@/domain/volume/state/volume.atom";
import { MyDropdown } from "@/shared/components/dropdown";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { MySpinner } from "@/shared/components/spinner";
import { RootCustomFileNode } from "@/shared/components/tree/custom-file-node";
import { CustomFileTree } from "@/shared/components/tree/custom-file-tree";
import { TABLE_MESSAGE } from "@/shared/constants/core.constant";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  checkIsSuperAdmin,
  getSessionAccountId,
} from "@/shared/utils/auth.util";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
  AsideDetailFooter,
} from "@/styles/layers/aside-detail-layers.styled";
import { customScrollbar } from "@/styles/mixins/scrollbar";

interface ManageVolumeFileProps {
  volumeId: number;
  creatorId?: string;
}

export function ManageVolumeFile({
  volumeId,
  creatorId,
}: ManageVolumeFileProps) {
  const publish = usePublish();
  const { data: session } = useSession();
  const checkedNodesInfo = useAtomValue(volumeFileCheckedNodesInfoAtom);
  const resetCheckedNodes = useResetAtom(volumeFileCheckedNodesAtom);

  const { treeData, loadingPaths, loadChildren, isLoading, isError } =
    useVolumeFileTree({
      volumeId,
      enabled: !Number.isNaN(volumeId),
    });

  const hasCheckedFiles = checkedNodesInfo.length > 0;

  // Footer 표시 조건: 생성자이거나 SUPER_ADMIN인 경우
  const currentAccountId = getSessionAccountId(session);
  const isSuperAdmin = checkIsSuperAdmin(session);
  const isCreator = currentAccountId === creatorId;
  const canManageFiles = isCreator || isSuperAdmin;

  const handleDownload = () => {
    if (!hasCheckedFiles) return;

    const filePaths = checkedNodesInfo.map((node) => node.path);
    publish(VOLUME_EVENTS.sendDownloadVolumeFile, { volumeId, filePaths });
  };

  const handleUpload = () => {
    publish(VOLUME_EVENTS.sendUploadVolumeFile, { volumeId });
  };

  const renderContent = () => {
    if (isLoading) return <MySpinner />;
    if (isError) return <EmptyState title={TABLE_MESSAGE.ERROR} />;
    if (treeData.length === 0) return <EmptyState title="파일이 없습니다." />;

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

  useEffect(() => {
    resetCheckedNodes();
  }, [resetCheckedNodes]);

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
        <PreviewVolumeFile treeData={treeData} />
      </Body>
      {canManageFiles && (
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
      )}
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

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

const FooterRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  flex: 1;
`;
