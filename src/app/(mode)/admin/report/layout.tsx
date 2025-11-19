"use client";

import type { PropsWithChildren } from "react";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { CreateReportModal } from "@/components/report/create-report-modal";
import { ADMIN_ROOT_BREADCRUMB_ITEM } from "@/constants/common/core.constant";
import {
  REPORT_GUIDE_IMAGES,
  REPORT_GUIDES,
} from "@/constants/report/report.constant";
import { PageGuide } from "@/layouts/common/page-guide";
import { PageHeader } from "@/layouts/common/page-header";
import { PageImageGuide } from "@/layouts/common/page-image-guide";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  ADMIN_ROOT_BREADCRUMB_ITEM,
  { title: "리포트" },
];

export default function AdminReportLayout({ children }: PropsWithChildren) {
  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 */}
      <PageHeader title="리포트" icon="Information" description="Report">
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>

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
            guides={REPORT_GUIDES}
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
            guideImages={REPORT_GUIDE_IMAGES}
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
