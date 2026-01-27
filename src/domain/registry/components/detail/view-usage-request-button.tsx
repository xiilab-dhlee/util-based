"use client";

import type { MouseEvent } from "react";
import { Icon } from "xiilab-ui";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

/** API 응답에 usageRequestId가 포함된 확장 타입 (orval 스키마 업데이트 전까지 임시 사용) */
type ImageTagListResponseWithUsageRequestId = ImageTagListResponse & {
  usageRequestId?: number;
};

interface ViewUsageRequestButtonProps {
  record: ImageTagListResponseWithUsageRequestId;
}

/**
 * 이미지 사용 요청 상세 보기 버튼
 *
 * 승인 대기 상태(APPROVAL_WAITING)인 경우 클릭 시 상세 모달을 열어
 * 요청 정보를 확인하고 취소할 수 있습니다.
 */
export function ViewUsageRequestButton({
  record,
}: ViewUsageRequestButtonProps) {
  const publish = usePublish();

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();

    publish(REGISTRY_EVENTS.openUsageRequestDetailModal, {
      ...record,
      usageRequestId: record.usageRequestId,
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <ColumnIconWrap
        type="button"
        onClick={handleClick}
        title="사용 요청 상세"
      >
        <Icon name="RequestResource" color="var(--icon-fill)" size={16} />
        <span className="sr-only">사용 요청 상세 버튼</span>
      </ColumnIconWrap>
    </ColumnAlignCenterWrap>
  );
}
