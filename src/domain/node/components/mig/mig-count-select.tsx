"use client";

import { useAtom, useAtomValue } from "jotai";
import type { DropdownOption } from "xiilab-ui";
import { Dropdown } from "xiilab-ui";

import { useMigHelper } from "@/domain/node/hooks/use-mig-helper";
import {
  migGpuProductAtom,
  selectedMigCountAtom,
  selectedMigGpuIndexAtom,
} from "@/domain/node/state/node.atom";
import { MigUtil } from "@/domain/node/utils/mig.util";

/**
 * MIG 개수 선택 컴포넌트
 *
 * GPU 제품 종류에 따라 사용 가능한 MIG 개수 옵션을 제공합니다.
 * 사용자가 MIG 개수를 선택하면 해당 GPU에 MIG를 초기화하거나 비활성화합니다.
 * A30 GPU는 Alpha 유틸리티를, 다른 GPU는 Beta 유틸리티를 사용합니다.
 *
 * @returns MIG 개수를 선택할 수 있는 드롭다운 컴포넌트
 */
export function MigCountSelect() {
  // 현재 선택된 MIG GPU 인덱스
  const selectedMigGpuIndex = useAtomValue(selectedMigGpuIndexAtom);
  // MIG GPU 제품 정보 (A30, A100 등)
  const migGpuProduct = useAtomValue(migGpuProductAtom);
  // 선택된 MIG 개수 (상태와 설정 함수)
  const [selectedMigCount, setSelectedMigCount] = useAtom(selectedMigCountAtom);
  // MIG 헬퍼 훅
  const migHelper = useMigHelper();

  /**
   * MIG 개수 선택 변경 핸들러
   *
   * 사용자가 새로운 MIG 개수를 선택했을 때 호출됩니다.
   * 선택된 개수를 상태에 저장하고, MIG 헬퍼를 통해 실제 MIG 초기화를 수행합니다.
   * "DISABLED" 선택 시 MIG를 비활성화하고, 그 외의 경우 MIG를 활성화합니다.
   *
   * @param value - 선택된 MIG 개수 또는 "DISABLED" (문자열)
   */
  const handleChangeSelect = (value: string) => {
    // 선택된 개수를 상태에 저장
    setSelectedMigCount(value);

    // MIG 활성화/비활성화 처리
    if (value === "DISABLED") {
      // MIG 비활성화
      migHelper.initMig(selectedMigGpuIndex, false);
    } else if (value) {
      // MIG 활성화
      migHelper.initMig(selectedMigGpuIndex, true);
    }
  };

  // GPU 제품이 선택되지 않은 경우 컴포넌트를 렌더링하지 않음
  if (!migGpuProduct) {
    return null;
  }

  // GPU 제품 종류에 따라 적절한 개수 옵션 생성
  let options: DropdownOption[] = [];
  if (migGpuProduct) {
    // GPU 제품을 기반으로 MigUtil 인스턴스 생성
    const util = new MigUtil(migGpuProduct);
    options = util.getCountOptions();
  }

  return (
    <Dropdown
      options={options}
      placeholder="개수 선택"
      onChange={handleChangeSelect}
      value={selectedMigCount}
      width={120}
      height={30}
    />
  );
}
