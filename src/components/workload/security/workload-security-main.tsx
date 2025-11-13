"use client";

import {
  DetailContentHeader,
  DetailContentTitle,
} from "@/styles/layers/detail-page-layers.styled";
import { WorkloadSecurityBody } from "./workload-security-body";
import { WorkloadSecurityFooter } from "./workload-security-footer";

export function WorkloadSecurityMain() {
  return (
    <>
      {/* 보안 페이지 영역 */}
      <DetailContentHeader>
        <DetailContentTitle>보안 취약점</DetailContentTitle>
      </DetailContentHeader>
      {/* 워크로드 보안 취약점 목록 본문 */}
      <WorkloadSecurityBody />
      {/* 워크로드 보안 취약점 목록 페이지네이션 */}
      <WorkloadSecurityFooter />
    </>
  );
}
