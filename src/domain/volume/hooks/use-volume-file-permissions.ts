import { useAtomValue } from "jotai";
import type { Session } from "next-auth";

import {
  volumeFileCheckedNodesInfoAtom,
  volumeFileSelectedNodeInfoAtom,
} from "@/domain/volume/state/volume.atom";
import type { VolumeMode } from "@/domain/volume/types/volume.type";
import { isCompressedFile } from "@/domain/volume/utils/volume.util";
import { getSessionAccountId } from "@/shared/utils/auth.util";

interface UseVolumeFilePermissionsParams {
  session: Session | null;
  creatorId?: string;
  treeDataLength: number;
  mode: VolumeMode;
}

export function useVolumeFilePermissions({
  session,
  creatorId,
  treeDataLength,
  mode,
}: UseVolumeFilePermissionsParams) {
  const checkedNodesInfo = useAtomValue(volumeFileCheckedNodesInfoAtom);
  const selectedNodeInfo = useAtomValue(volumeFileSelectedNodeInfoAtom);

  const hasCheckedFiles = checkedNodesInfo.length > 0;

  // 권한 체크
  const currentAccountId = getSessionAccountId(session);
  const isCreator = Boolean(
    creatorId && currentAccountId && currentAccountId === creatorId,
  );
  const isUserMode = mode === "user";

  // 파일 관리 권한
  // - 사용자 모드: 생성자만 가능
  // - 관리자 모드: 모두 가능
  const canManageFiles = isUserMode ? isCreator : true;

  // 파일 업로드 권한: 모드에 상관없이 생성자만 가능
  const canUpload = isCreator;

  // 드롭다운 버튼 표시 조건 (canManageFiles와 결합)
  const canCreateFolder =
    canManageFiles &&
    (selectedNodeInfo?.type === "directory" || treeDataLength === 0);
  const canCompress = canManageFiles && hasCheckedFiles;
  const canDecompress =
    canManageFiles &&
    checkedNodesInfo.length === 1 &&
    isCompressedFile(checkedNodesInfo[0].path);
  const canDelete = canManageFiles && hasCheckedFiles && treeDataLength > 0;
  const canDownload = canManageFiles && hasCheckedFiles;

  // 드롭다운 메뉴에 표시할 항목이 하나라도 있는지
  const hasDropdownItems =
    canCreateFolder || canCompress || canDecompress || canDelete;

  return {
    checkedNodesInfo,
    hasCheckedFiles,
    canCreateFolder,
    canCompress,
    canDecompress,
    canDelete,
    canDownload,
    hasDropdownItems,
    canManageFiles,
    canUpload,
  };
}
