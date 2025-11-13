"use client";

import { useEffect } from "react";

import { PrivateRegistryListBody } from "@/components/private-registry/list/private-registry-list-body";
import type { PrivateRegistryImage } from "@/types/private-registry/private-registry.model";

interface PrivateRegistryListClientWrapperProps {
  /** 서버에서 전달받은 초기 내부 레지스트리 이미지 데이터 */
  initialImages?: PrivateRegistryImage[];
}

/**
 * 내부 레지스트리 목록의 클라이언트 사이드 래퍼 컴포넌트
 *
 * 서버 컴포넌트에서 전달받은 초기 데이터를 클라이언트 상태로 설정하고,
 * 클라이언트 사이드에서 실행되어야 하는 목록 표시 로직을 담당합니다.
 */
export function PrivateRegistryListClientWrapper({
  initialImages = [],
}: PrivateRegistryListClientWrapperProps) {
  // TODO: 필요 시 상태 관리 로직 추가

  // 서버에서 전달받은 초기 데이터로 클라이언트 상태 초기화
  useEffect(() => {
    if (initialImages.length > 0) {
      // TODO: 필요 시 초기 데이터로 상태 설정
      console.log("초기 내부 레지스트리 이미지 데이터:", initialImages);
    }
  }, [initialImages]);

  return <PrivateRegistryListBody />;
}

