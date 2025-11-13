"use client";

import { Button, Icon } from "xiilab-ui";

import { openCreateReportModalAtom } from "@/atoms/report/report.atom";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { SearchNoResult } from "@/layouts/common/search-no-result";
import {
  DetailContentHeader,
  DetailContentTitle,
} from "@/styles/layers/detail-page-layers.styled";

export function UnreadyReport() {
  const { onOpen } = useGlobalModal(openCreateReportModalAtom);

  const handleCreate = () => {
    onOpen();
  };

  return (
    <>
      <DetailContentHeader>
        <DetailContentTitle>리포트</DetailContentTitle>
        <Button
          color="primary"
          icon="Information"
          iconPosition="left"
          variant="gradient"
          width={120}
          height={30}
          onClick={handleCreate}
        >
          리포트 생성
        </Button>
      </DetailContentHeader>
      <SearchNoResult
        icon={<Icon name="DocumentFilled" color="#878898" size={32} />}
        title="생성된 리포트가 없습니다."
        description="상단의 리포트 생성 버튼을 클릭하여 리포트를 생성해 보세요."
      />
    </>
  );
}

