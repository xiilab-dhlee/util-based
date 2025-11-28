"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";
import { Icon } from "xiilab-ui";

import { CreateWorkloadDrawer } from "@/shared/components/drawer/create-workload-drawer";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { isUserMode } from "@/shared/utils/router.util";
import {
  DetailContentButton,
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";
import { useGetWorkloadByMode } from "../../hooks/use-get-workload-by-mode";
import { CreateCommitImageModal } from "./create-commit-image-modal";
import { WorkloadPrimaryArticle } from "./workload-primary-article";
import { WorkloadSecondaryArticle } from "./workload-secondary-article";

export function WorkloadDetailMain() {
  const publish = usePublish();

  const pathname = usePathname();

  const { id } = useParams();
  const searchParams = useSearchParams();

  // hooks는 항상 최상위에서 호출
  const { data } = useGetWorkloadByMode({
    workspaceId: String(searchParams?.get("workspaceId")),
    workloadId: String(id),
  });

  const isUser = isUserMode(pathname);

  const handleClickCloneWorkload = () => {
    publish(WORKLOAD_EVENTS.sendCreateWorkload, data);
  };

  return (
    <>
      {/* 상세 페이지 영역 */}
      <DetailContentHeader>
        <DetailContentTitle>워크로드 상세정보</DetailContentTitle>
        <DetailContentTitleTool>
          {isUser && (
            <div style={{ width: 120, height: 30 }}>
              <DetailContentButton onClick={handleClickCloneWorkload}>
                <Icon name="Copy" color="var(--icon-fill)" />
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
      {/* 워크로드 복제 모달 */}
      <CreateWorkloadDrawer />
    </>
  );
}
