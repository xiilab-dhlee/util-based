import { useAtomValue } from "jotai";
import type { Session } from "next-auth";

import {
  volumeFileCheckedNodesInfoAtom,
  volumeFileSelectedNodeInfoAtom,
} from "@/domain/volume/state/volume.atom";
import { isCompressedFile } from "@/domain/volume/utils/volume.util";
import {
  checkIsSuperAdmin,
  getSessionAccountId,
} from "@/shared/utils/auth.util";

interface UseVolumeFilePermissionsParams {
  session: Session | null;
  creatorId?: string;
  treeDataLength: number;
}

export function useVolumeFilePermissions({
  session,
  creatorId,
  treeDataLength,
}: UseVolumeFilePermissionsParams) {
  const checkedNodesInfo = useAtomValue(volumeFileCheckedNodesInfoAtom);
  const selectedNodeInfo = useAtomValue(volumeFileSelectedNodeInfoAtom);

  const hasCheckedFiles = checkedNodesInfo.length > 0;

  // 드롭다운 버튼 표시 조건
  const canCreateFolder =
    selectedNodeInfo?.type === "directory" || treeDataLength === 0;
  const canCompress = hasCheckedFiles;
  const canDecompress =
    checkedNodesInfo.length === 1 && isCompressedFile(checkedNodesInfo[0].path);
  const canDelete = hasCheckedFiles && treeDataLength > 0;

  // 드롭다운 메뉴에 표시할 항목이 하나라도 있는지
  const hasDropdownItems =
    canCreateFolder || canCompress || canDecompress || canDelete;

  // Footer 표시 조건: 생성자이거나 SUPER_ADMIN인 경우
  const currentAccountId = getSessionAccountId(session);
  const isSuperAdmin = checkIsSuperAdmin(session);
  const isCreator = Boolean(
    creatorId && currentAccountId && currentAccountId === creatorId,
  );
  const canManageFiles = isSuperAdmin || isCreator;

  return {
    checkedNodesInfo,
    hasCheckedFiles,
    canCreateFolder,
    canCompress,
    canDecompress,
    canDelete,
    hasDropdownItems,
    canManageFiles,
  };
}
