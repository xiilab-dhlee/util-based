"use client";

import type { PropsWithChildren } from "react";
import { Icon } from "xiilab-ui";

import { CreateReportModal } from "@/components/report/create-report-modal";
import { PageGuide } from "@/layouts/common/page-guide";
import { PageHeader } from "@/layouts/common/page-header";
import { PageImageGuide } from "@/layouts/common/page-image-guide";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreGuide, CoreGuideImage } from "@/types/common/core.model";

const GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/report-guide1.png",
    alt: "리포트 가이드 1",
  },
  {
    id: "2",
    src: "/images/report-guide2.png",
    alt: "리포트 가이드 2",
  },
  {
    id: "3",
    src: "/images/report-guide3.png",
    alt: "리포트 가이드 3",
  },
];

const GUIDES: CoreGuide[] = [
  {
    icon: <Icon name="Reportsolid" color="var(--icon-fill)" />,
    title: "리포트란?",
    description: [
      "자원 활용 현황, 통계 등의 정보를 모아 볼 수 있는 기능입니다.",
      "기간을 설정하고 리포트 생성 후 PDF 다운로드 가능합니다.",
    ],
  },
  {
    icon: <Icon name="ReportReservationsolid" color="var(--icon-fill)" />,
    title: "리포트 예약이란?",
    description: [
      "리포트 생성 주기와 받는 사람을 지정하여 리포트를 생성하는",
      "기능입니다. 주기적으로 자원 효율 정도를 관리할 수 있습니다.",
    ],
  },
];

export default function AdminReportLayout({ children }: PropsWithChildren) {
  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 */}
      <PageHeader
        title="리포트"
        icon="Information"
        description="Report"
        breadcrumbKey="admin.report"
      />

      {/* 리포트 페이지 메인 영역 */}
      <ListPageMain>
        {/* 리포트 페이지 - 왼쪽 영역 (가이드 및 정보 카드) */}
        <ListPageAside $width={400}>
          <PageGuide
            titleEng="About Report"
            title="리포트 예약"
            icon="ReportReservationsolid"
            description={[
              "발송 주기를 설정하여 리포트를 예약할 수 있습니다.",
              "리포트 받는 사람을 설정하여 관리할 수 있습니다.",
            ]}
            backgroundImageName="report-intro-background.png"
            guides={GUIDES}
            buttonOptions={{
              enabled: true,
              text: "리포트 예약 바로가기",
              onClick: () => {
                // router.push("/admin/report/reservation");
              },
            }}
          />
          {/* 가이드 이미지 카드 */}
          <PageImageGuide
            title="리포트 설정 가이드"
            guideImages={GUIDE_IMAGES}
          />
        </ListPageAside>

        {/* 리포트 페이지 - 오른쪽 영역 (리포트 콘텐츠) */}
        <ListPageBody>{children}</ListPageBody>
      </ListPageMain>
      {/* 리포트 생성 모달 */}
      <CreateReportModal />
    </>
  );
}
