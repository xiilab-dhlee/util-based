"use client";

import { usePathname } from "next/navigation";

import { MyIcon } from "@/components/common/icon";
import {
  DetailContentButton,
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";
import { isUserMode } from "@/utils/common/router.util";
import { CreateCommitImageModal } from "./create-commit-image-modal";
import { WorkloadPrimaryArticle } from "./workload-primary-article";
import { WorkloadSecondaryArticle } from "./workload-secondary-article";

export function WorkloadDetailMain() {
  const pathname = usePathname();

  const isStandard = isUserMode(pathname);

  return (
    <>
      {/* 상세 페이지 영역 */}
      <DetailContentHeader>
        <DetailContentTitle>워크로드 상세정보</DetailContentTitle>
        <DetailContentTitleTool>
          {isStandard && (
            <div style={{ width: 120, height: 30 }}>
              <DetailContentButton onClick={() => alert("준비 중입니다.")}>
                <MyIcon name="Copy" color="var(--icon-fill)" />
                워크로드 복제
              </DetailContentButton>
            </div>
          )}

          <div style={{ width: 80, height: 30 }}>
            <DetailContentButton onClick={() => alert("준비 중입니다.")}>
              삭제
            </DetailContentButton>
          </div>
        </DetailContentTitleTool>
      </DetailContentHeader>
      {/* 워크로드 상세 페이지 기본 정보 아티클 */}
      <WorkloadPrimaryArticle />
      {/* 워크로드 상세 페이지 추가 정보 아티클 */}
      <WorkloadSecondaryArticle />
      {/* 커밋 이미지 생성 모달 */}
      <CreateCommitImageModal />
    </>
  );
}
