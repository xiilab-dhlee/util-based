"use client";

import { useAtom, useAtomValue } from "jotai";
import type { DropdownOption } from "xiilab-ui";
import { Dropdown } from "xiilab-ui";

import {
  migGpuProductAtom,
  selectedMigConfigIdAtom,
  selectedMigCountAtom,
  selectedMigGpuIndexAtom,
} from "@/atoms/node.atom";
import { useMigHelper } from "@/hooks/node/use-mig-helper";
import { MigUtil } from "@/utils/node/mig.util";

/**
 * MIG 설정 선택 컴포넌트
 *
 * GPU 제품 종류와 MIG 개수에 따라 사용 가능한 MIG 설정 옵션을 제공합니다.
 * A30 GPU는 Alpha 유틸리티를, 다른 GPU는 Beta 유틸리티를 사용하여
 * 설정 옵션을 생성합니다.
 *
 * @returns MIG 설정을 선택할 수 있는 드롭다운 컴포넌트
 */
export function MigConfigSelect() {
  // 현재 선택된 MIG GPU 인덱스
  const selectedMigGpuIndex = useAtomValue(selectedMigGpuIndexAtom);
  // MIG GPU 제품 정보 (A30, A100 등)
  const migGpuProduct = useAtomValue(migGpuProductAtom);
  // 선택된 MIG 개수
  const selectedMigCount = useAtomValue(selectedMigCountAtom);
  // 선택된 MIG 설정 ID (상태와 설정 함수)
  const [selectedMigConfigId, setSelectedMigConfigId] = useAtom(
    selectedMigConfigIdAtom,
  );
  // MIG 헬퍼 훅
  const migHelper = useMigHelper();

  /**
   * MIG 설정 선택 변경 핸들러
   *
   * 사용자가 새로운 MIG 설정을 선택했을 때 호출됩니다.
   * 선택된 설정 ID를 상태에 저장하고 MIG 헬퍼를 통해 실제 MIG 설정을 업데이트합니다.
   *
   * @param value - 선택된 설정 ID (문자열)
   */
  const handleChangeSelect = (value: string | null) => {
    if (value) {
      // 설정 ID를 숫자로 변환하여 상태에 저장
      setSelectedMigConfigId(+value);

      // MIG 헬퍼를 통해 실제 MIG 설정 업데이트
      migHelper.updateMig(selectedMigGpuIndex, +value);
    }
  };

  // MIG가 비활성화되었거나 GPU 제품이 선택되지 않은 경우 컴포넌트를 렌더링하지 않음
  if (selectedMigCount === "DISABLED" || !migGpuProduct) {
    return null;
  }

  // GPU 제품 종류에 따라 적절한 설정 옵션 생성
  let options: DropdownOption[] = [];
  if (migGpuProduct) {
    // GPU 제품을 기반으로 MigUtil 인스턴스 생성
    const util = new MigUtil(migGpuProduct);
    options = util.getConfigOptions(selectedMigCount);
  }

  return (
    <Dropdown
      options={options}
      placeholder="Config 선택"
      onChange={handleChangeSelect}
      value={selectedMigConfigId === -1 ? null : selectedMigConfigId.toString()}
      width={230}
      height={30}
    />
  );
}
