"use client";

import classNames from "classnames";
import { useAtomValue } from "jotai";
import styled from "styled-components";

import { migGpuProductAtom, selectedMigConfigIdAtom } from "@/atoms/node.atom";
import { useMigHelper } from "@/hooks/node/use-mig-helper";
import type { GpuInstanceNode } from "@/types/node/node.type";

/**
 * GPU 인스턴스 컴포넌트 Props
 * MIG(Multi-Instance GPU) 설정에서 개별 GPU 인스턴스를 표시하는 컴포넌트
 */
interface GpuInstanceProps extends GpuInstanceNode {}

/**
 * GPU 인스턴스 컴포넌트
 *
 * MIG 설정에서 생성된 GPU 인스턴스의 상태를 시각적으로 표시합니다.
 * 선택된 MIG 설정에 따라 인스턴스의 활성화 상태를 결정하고,
 * 활성화된 인스턴스는 다른 스타일로 표시됩니다.
 *
 * @param gpuIndex - GPU 인덱스 (1부터 시작)
 * @param name - GPU 인스턴스 이름
 * @returns GPU 인스턴스 상태를 표시하는 컴포넌트
 */
export function GpuInstance({ gpuIndex, name }: GpuInstanceProps) {
  // 현재 선택된 MIG 설정 ID
  const selectedMigConfigId = useAtomValue(selectedMigConfigIdAtom);
  // MIG GPU 제품 정보
  const migGpuProduct = useAtomValue(migGpuProductAtom);
  // MIG 헬퍼 훅
  const migHelper = useMigHelper();

  // 선택된 MIG 설정에 따른 인스턴스 정보 조회
  const instances = migHelper.getInstance(selectedMigConfigId, migGpuProduct);

  // 표시할 이름 결정 (기본값: "N/A")
  let displayName = "N/A";
  if (name) {
    displayName = name.toUpperCase();
  }

  // 인스턴스 활성화 상태 확인
  let isActive = false;
  // gpuIndex가 존재하는 경우에만 활성화 상태 확인
  // gpuIndex는 1부터 시작하므로 배열 인덱스로 변환 (gpuIndex - 1)
  if (gpuIndex) {
    isActive = instances[gpuIndex - 1];
  }

  return (
    <Container
      data-profile={name}
      className={classNames({
        active: isActive, // 활성화된 인스턴스는 다른 스타일 적용
      })}
    >
      {displayName}
    </Container>
  );
}

/**
 * GPU 인스턴스 컨테이너 스타일
 *
 * 기본 상태와 활성화 상태의 스타일을 정의합니다.
 * 활성화된 인스턴스는 파란색 테두리와 굵은 글씨로 강조 표시됩니다.
 */
const Container = styled.div`
  /* 기본 스타일 */
  background-color: #fff;
  border: 1px solid #e1e4e7;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  color: #55585b;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  /* 활성화된 인스턴스 스타일 */
  &.active {
    color: #00195f; /* 파란색 텍스트 */
    font-weight: 600; /* 굵은 글씨 */
    border: 1px solid #1f5bff; /* 파란색 테두리 */
    outline: 1px solid #b7cbff; /* 파란색 외곽선 */
  }
`;
