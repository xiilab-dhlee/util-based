"use client";

import { useAtomValue } from "jotai";

import { migGpuProductAtom } from "@/atoms/node/node-list.atom";
import nodeMigConstants from "@/constants/node/node-mig.constant";
import GenerateDisplayConfigAlpha from "./generate-display-config-alpha";
import GenerateDisplayConfigBeta from "./generate-display-config-beta";

/**
 * 디스플레이 설정 선택 컴포넌트
 *
 * GPU 제품 종류에 따라 적절한 디스플레이 설정 컴포넌트를 렌더링합니다.
 * A30 GPU는 특별한 처리가 필요한 Alpha 컴포넌트를 사용하고,
 * 다른 GPU 제품들은 Beta 컴포넌트를 사용합니다.
 *
 * @returns GPU 제품에 맞는 디스플레이 설정 컴포넌트
 */
export function SelectDisplayConfig() {
  // 현재 선택된 MIG GPU 제품 정보
  const migGpuProduct = useAtomValue(migGpuProductAtom);

  /**
   * GPU 제품에 따른 컴포넌트 렌더링 함수
   *
   * GPU 제품 종류를 확인하여 적절한 디스플레이 설정 컴포넌트를 반환합니다.
   * A30은 특별한 처리가 필요한 Alpha 컴포넌트를 사용하고,
   * 다른 GPU 제품들은 Beta 설정을 사용합니다.
   *
   * @param gpuProduct - GPU 제품명 (A30, A100 등)
   * @returns 해당 GPU 제품에 맞는 디스플레이 설정 컴포넌트
   */
  const renderComponent = (gpuProduct: string) => {
    // GPU 제품이 선택되지 않은 경우
    if (!gpuProduct) {
      return <div>조회된 결과가 없습니다.</div>;
    }

    // A30 GPU는 특별한 처리가 필요한 Alpha 컴포넌트 사용
    if (gpuProduct === "A30") {
      const gpuConfig = nodeMigConstants.gpuAlphaConfigs[gpuProduct];
      if (gpuConfig) {
        return <GenerateDisplayConfigAlpha config={gpuConfig} />;
      }
    }

    // 다른 GPU 제품들은 Beta 설정을 사용
    const gpuConfig = nodeMigConstants.gpuBetaConfigs[gpuProduct];
    if (gpuConfig) {
      return <GenerateDisplayConfigBeta config={gpuConfig} />;
    }

    // 지원하지 않는 GPU 제품인 경우
    return <div className="no-result">MIG를 지원하지 않습니다.</div>;
  };

  return renderComponent(migGpuProduct);
}

