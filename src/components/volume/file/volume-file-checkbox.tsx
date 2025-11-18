"use client";

import { useAtom } from "jotai";
import { Checkbox } from "xiilab-ui";

import { volumeFileCheckedNodesAtom } from "@/atoms/volume/volume-file.atom";

/**
 * VolumeFileCheckbox 컴포넌트의 props 인터페이스
 */
interface VolumeFileCheckboxProps {
  /** 체크박스가 연결된 파일/디렉토리의 고유 키 (경로) */
  activeKey: string;
}

/**
 * VolumeFileCheckbox 컴포넌트
 *
 * 볼륨 파일 트리에서 개별 파일/디렉토리의 선택 상태를 관리하는 체크박스 컴포넌트입니다.
 * Jotai atom을 사용하여 전역 상태로 체크된 노드들을 관리하며,
 * 체크박스의 상태 변경 시 자동으로 전역 상태를 업데이트합니다.
 *
 * @param activeKey - 체크박스가 연결된 파일/디렉토리의 고유 키 (경로)
 * @returns 체크박스 UI 컴포넌트
 */
export function VolumeFileCheckbox({ activeKey }: VolumeFileCheckboxProps) {
  // 체크된 노드들의 전역 상태를 관리하는 atom
  const [checkedNodes, setCheckedNodes] = useAtom(volumeFileCheckedNodesAtom);

  /**
   * 체크박스 상태 변경 핸들러
   *
   * @param path - 파일/디렉토리 경로
   * @param checked - 체크 상태 (true: 체크됨, false: 체크 해제됨)
   */
  const handleCheckChange = (activeKey: string, checked: boolean) => {
    setCheckedNodes((prev) => {
      // 기존 체크된 노드들의 Set을 복사
      const next = new Set(prev);

      if (checked) {
        next.add(activeKey);
      } else {
        next.delete(activeKey);
      }

      return next;
    });
  };

  return (
    <Checkbox
      size="small"
      checked={checkedNodes.has(activeKey)}
      onChange={(e) => handleCheckChange(activeKey, e.target.checked)}
    />
  );
}
