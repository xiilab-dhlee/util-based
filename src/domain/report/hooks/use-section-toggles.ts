"use client";

import { useCallback, useState } from "react";

/**
 * 여러 섹션의 showAll 토글 상태를 관리하는 훅
 *
 * @param sections - 관리할 섹션 키 배열
 * @param defaultValue - 초기 토글 상태 (기본값: false)
 * @returns 토글 상태 맵과 세터 함수
 *
 * @example
 * const { toggles, setToggle, getToggleProps } = useSectionToggles([
 *   'userGpu',
 *   'nodeSystem',
 *   'gpuTemp',
 * ]);
 *
 * // 개별 사용
 * <Table showAll={toggles.userGpu} onToggleShowAll={(v) => setToggle('userGpu', v)} />
 *
 * // getToggleProps 사용 (권장)
 * <Table {...getToggleProps('userGpu')} />
 */
export function useSectionToggles<T extends string>(
  sections: T[],
  defaultValue = false,
) {
  // 초기 상태 생성
  const initialState = sections.reduce(
    (acc, section) => {
      acc[section] = defaultValue;
      return acc;
    },
    {} as Record<T, boolean>,
  );

  const [toggles, setToggles] = useState<Record<T, boolean>>(initialState);

  /**
   * 특정 섹션의 토글 상태를 변경합니다.
   *
   * @param section - 변경할 섹션 키
   * @param value - 새로운 토글 값
   */
  const setToggle = useCallback((section: T, value: boolean) => {
    setToggles((prev) => ({
      ...prev,
      [section]: value,
    }));
  }, []);

  /**
   * 특정 섹션의 토글 Props를 반환합니다.
   * 컴포넌트에 spread하여 사용할 수 있습니다.
   *
   * @param section - 섹션 키
   * @returns showAll과 onToggleShowAll props 객체
   */
  const getToggleProps = useCallback(
    (section: T) => ({
      showAll: toggles[section],
      onToggleShowAll: (value: boolean) => setToggle(section, value),
    }),
    [toggles, setToggle],
  );

  return {
    /** 모든 섹션의 토글 상태 맵 */
    toggles,
    /** 특정 섹션 토글 상태 변경 함수 */
    setToggle,
    /** 컴포넌트 Props 생성 헬퍼 */
    getToggleProps,
  };
}

/**
 * 시스템 리포트에서 사용하는 섹션 키 타입
 */
export type SystemReportSection =
  | "userGpu"
  | "nodeSystem"
  | "gpuTemp"
  | "cpuUsage"
  | "memoryUsage"
  | "diskUsage";

/**
 * 클러스터 리포트에서 사용하는 섹션 키 타입
 */
export type ClusterReportSection = "nodeWorkload" | "nodeResource";
