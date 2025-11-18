"use client";

import classNames from "classnames";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";

import {
  migGpuProductAtom,
  migGpusAtom,
  selectedMigConfigIdAtom,
  selectedMigCountAtom,
  selectedMigGpuIndexAtom,
} from "@/atoms/node.atom";
import { useMigHelper } from "@/hooks/node/use-mig-helper";
import type { MigGpu } from "@/types/node/node.type";

/**
 * MIG GPU 아이템 컴포넌트 Props
 * 개별 GPU를 선택할 수 있는 버튼 컴포넌트
 */
interface MigGpuItemProps extends MigGpu {
  /** GPU 인덱스 (0부터 시작) */
  gpuIndex: number;
}

/**
 * MIG GPU 아이템 컴포넌트
 *
 * 개별 GPU를 선택할 수 있는 버튼 컴포넌트입니다.
 * 사용자가 GPU를 클릭하면 해당 GPU의 MIG 설정 정보를 불러와서
 * 관련 상태들을 업데이트합니다.
 *
 * @param gpuIndex - GPU 인덱스
 * @returns GPU 선택 버튼 컴포넌트
 */
export function MigGpuItem({ gpuIndex }: MigGpuItemProps) {
  // MIG GPU 목록 정보
  const migGpus = useAtomValue(migGpusAtom);
  // MIG GPU 제품 정보 (A30, A100 등)
  const migGpuProduct = useAtomValue(migGpuProductAtom);
  // 선택된 MIG 개수 설정 함수
  const setSelectedMigCount = useSetAtom(selectedMigCountAtom);
  // MIG 헬퍼 훅
  const migHelper = useMigHelper();

  // 선택된 MIG GPU 인덱스 (상태와 설정 함수)
  const [selectedMigGpuIndex, setSelectedMigGpuIndex] = useAtom(
    selectedMigGpuIndexAtom,
  );
  // 선택된 MIG 설정 ID 설정 함수
  const setSelectedMigConfigId = useSetAtom(selectedMigConfigIdAtom);

  /**
   * GPU 클릭 핸들러
   *
   * 사용자가 GPU 버튼을 클릭했을 때 호출됩니다.
   * 선택된 GPU의 설정 정보를 불러와서 관련 상태들을 업데이트합니다.
   * - 선택된 GPU 인덱스 설정
   * - 해당 GPU의 MIG 설정 ID 설정
   * - MIG 인스턴스 개수에 따른 개수 상태 설정
   */
  const handleClick = () => {
    // 선택된 GPU 인덱스 설정
    setSelectedMigGpuIndex(gpuIndex);

    // 해당 GPU의 설정 ID 가져오기
    const configId = migGpus[gpuIndex].configId;

    // MIG 헬퍼를 통해 인스턴스 개수 계산
    const count = migHelper.getInstanceCount(configId, migGpuProduct);

    // 인스턴스 개수에 따른 상태 설정
    if (count === 0) {
      // MIG가 비활성화된 경우
      setSelectedMigCount("DISABLED");
    } else {
      // MIG가 활성화된 경우 개수 설정
      setSelectedMigCount(count.toString());
    }

    // 선택된 MIG 설정 ID 설정
    setSelectedMigConfigId(configId);
  };

  return (
    <Container
      type="button"
      className={classNames({
        active: selectedMigGpuIndex === gpuIndex, // 현재 선택된 GPU인지 확인
      })}
      onClick={handleClick}
    >
      GPU# {gpuIndex}
    </Container>
  );
}

/**
 * MIG GPU 아이템 컨테이너 스타일
 *
 * GPU 선택 버튼의 기본 스타일과 활성화 상태 스타일을 정의합니다.
 * 활성화된 GPU는 파란색 테두리와 굵은 글씨로 강조 표시됩니다.
 */
const Container = styled.button`
  /* 기본 레이아웃 */
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
  height: 44px;

  /* 기본 텍스트 스타일 */
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #00195f;
  border-radius: 2px;
  flex-shrink: 0;

  /* 호버 효과 */
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  /* 활성화된 GPU 스타일 */
  &.active {
    color: #464b51; /* 회색 텍스트 */
    font-weight: 600; /* 굵은 글씨 */
    border: 1px solid #1f5bff; /* 파란색 테두리 */
    outline: 1px solid #b7cbff; /* 파란색 외곽선 */
  }
`;
