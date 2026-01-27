import { useAtomValue } from "jotai";
import { useSession } from "next-auth/react";

import {
  workloadFileCheckedNodesInfoAtom,
  workloadFileSelectedNodeInfoAtom,
} from "@/domain/workload/state/workload.atom";
import { checkIsAdmin, getSessionAccountId } from "@/shared/utils/auth.util";
import { isCompressedFile } from "@/shared/utils/filetree.util";

interface UseWorkloadFilePermissionsParams {
  creatorId?: string;
  treeDataLength: number;
}

/**
 * 워크로드 파일 권한 관리 훅
 *
 * 사용자 권한과 파일 트리의 상태에 따라 각종 버튼의 표시 여부를 결정합니다.
 *
 * 권한 규칙:
 * - 생성자: 모든 파일 관리 기능 사용 가능
 * - 관리자: 모든 파일 관리 기능 사용 가능
 * - 일반 사용자: 파일 관리 기능 사용 불가
 */
export function useWorkloadFilePermissions({
  creatorId,
  treeDataLength,
}: UseWorkloadFilePermissionsParams) {
  const { data: session } = useSession();
  const selectedNodeInfo = useAtomValue(workloadFileSelectedNodeInfoAtom);
  const checkedNodesInfo = useAtomValue(workloadFileCheckedNodesInfoAtom);

  const hasCheckedFiles = checkedNodesInfo.length > 0;

  // ============================================
  // 사용자 권한 확인
  // ============================================
  const currentAccountId = getSessionAccountId(session);
  const isCreator = Boolean(
    creatorId && currentAccountId && currentAccountId === creatorId,
  );
  const isAdmin = checkIsAdmin(session);

  // 파일 관리 권한: 생성자 또는 관리자만 가능
  const canManageFiles = isCreator || isAdmin;

  // 파일 업로드 권한: 생성자 또는 관리자만 가능
  const canUpload = canManageFiles;

  // ============================================
  // 개별 기능 권한 (canManageFiles와 결합)
  // ============================================

  // 폴더 생성 가능 여부:
  // - 권한이 있고
  // - 루트 위치 선택 시 (selectedNodeInfo가 null) 또는
  // - 선택된 노드가 디렉토리일 때 또는
  // - 파일이 없을 때
  const canCreateFolder =
    canManageFiles &&
    (selectedNodeInfo == null ||
      selectedNodeInfo.type === "directory" ||
      treeDataLength === 0);

  // 압축 가능 여부: 권한이 있고 체크된 파일이 있을 때
  const canCompress = canManageFiles && hasCheckedFiles;

  // 압축 해제 가능 여부: 권한이 있고 체크된 파일이 1개이고 파일 타입이며 압축 파일일 때
  const canDecompress =
    canManageFiles &&
    checkedNodesInfo.length === 1 &&
    checkedNodesInfo[0].type === "file" &&
    isCompressedFile(checkedNodesInfo[0].path);

  // 삭제 가능 여부: 권한이 있고 체크된 파일이 있을 때
  const canDelete = canManageFiles && hasCheckedFiles;

  // 다운로드 가능 여부: 권한이 있고 체크된 파일이 있을 때
  const canDownload = canManageFiles && hasCheckedFiles;

  return {
    // 권한 상태
    canManageFiles,
    canUpload,
    isCreator,
    isAdmin,
    // 개별 기능 권한
    checkedNodesInfo,
    hasCheckedFiles,
    canCreateFolder,
    canCompress,
    canDecompress,
    canDelete,
    canDownload,
  };
}
