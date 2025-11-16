"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import { redfishLogColumn } from "@/components/common/column/redfish-log-column";
import { MyIcon } from "@/components/common/icon";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { useGetNodeBmcInfo } from "@/hooks/node/use-get-bmc-info";
import { useGetNode } from "@/hooks/node/use-get-node";
import { useGetRedfishSystemLog } from "@/hooks/node/use-get-redfish-system-log";
import { useGetRedfishSystems } from "@/hooks/node/use-get-redfish-systems";
import {
  DetailContentArticle,
  DetailContentTitle,
} from "@/styles/layers/detail-page-layers.styled";
import { subTitleStyle } from "@/styles/mixins/text";
import { getRedfishSystemId } from "@/utils/node/redfish.util";
import { NodeLogRow } from "./node-log-row";

/**
 * Redfish 연동 상태의 로그 컴포넌트
 *
 * 노드에 Redfish가 연동된 경우 표시되는 컴포넌트로,
 * 시스템 로그를 테이블 형태로 조회하고 페이지네이션을 제공합니다.
 * 각 로그 항목은 확장 가능한 행으로 구성되어 상세 정보를 표시합니다.
 */
export function ReadyLog() {
  // URL 파라미터에서 노드 이름 추출
  const { name } = useParams();

  // 페이지네이션 상태 관리
  const [page, setPage] = useState(1);

  // 노드 정보 조회
  const { data } = useGetNode(String(name));

  // BMC 정보 조회
  const { data: bmcData } = useGetNodeBmcInfo(data?.node.ip || "");

  // Redfish 시스템 정보 조회
  const { data: systemData } = useGetRedfishSystems(bmcData?.bmcIp);

  // 시스템 ID 추출
  const systemId = getRedfishSystemId(
    (systemData?.Members?.[0] as Record<string, unknown>) || {},
  );

  // 시스템 로그 조회
  const { data: logData } = useGetRedfishSystemLog(
    bmcData?.bmcIp,
    systemId,
    page,
  );

  // 로그 데이터 처리
  const logs = logData?.logs?.Members || [];
  const currentLogCount = logs.length;
  const pageSize = 10; // DEFAULT_PAGE_SIZE와 동일
  const hasMoreData = currentLogCount === pageSize; // 현재 페이지가 가득 찬 경우 더 많은 데이터가 있을 가능성

  /**
   * 이전 페이지로 이동하는 핸들러
   */
  const handleBackClick = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  /**
   * 다음 페이지로 이동하는 핸들러
   */
  const handleFrontClick = () => {
    if (hasMoreData) {
      setPage(page + 1);
    }
  };

  return (
    <Article>
      {/* 로그 목록 헤더 */}
      <Header>
        <Title>
          로그 목록
          <Total>총 {page > 1 || hasMoreData ? "?" : currentLogCount}개</Total>
        </Title>
      </Header>

      {/* 로그 테이블 */}
      <Body>
        <CustomizedTable
          columns={redfishLogColumn}
          data={logs}
          columnHeight={32}
          bodyBgColor="transparent"
          activePadding
          customRow={NodeLogRow}
        />
      </Body>

      {/* 페이지네이션 컨트롤 */}
      <Footer>
        <IconWrapper
          type="button"
          onClick={handleBackClick}
          disabled={page === 1}
        >
          <MyIcon name="Back" color="var(--icon-fill)" size={20} />
        </IconWrapper>
        <IconWrapper
          type="button"
          onClick={handleFrontClick}
          disabled={!hasMoreData}
        >
          <MyIcon name="Front" color="var(--icon-fill)" size={20} />
        </IconWrapper>
      </Footer>
    </Article>
  );
}

// ===== Styled Components =====

/** 메인 아티클 컨테이너 - 로그 목록 전체 영역 */
const Article = styled(DetailContentArticle)`
  flex: 1;
  padding: 20px;
  overflow: hidden;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
`;

/** 헤더 영역 - 제목과 총 개수 표시 */
const Header = styled.div`
  padding-left: 5px;
  margin-bottom: 20px;
`;

/** 바디 영역 - 로그 테이블 표시 */
const Body = styled.div`
  flex: 1;
  width: 100%;
  overflow: hidden;
`;

/** 푸터 영역 - 페이지네이션 컨트롤 */
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 30px;
`;

/** 제목 스타일 */
const Title = styled(DetailContentTitle)`
  ${subTitleStyle(5)}
`;

/** 총 개수 표시 텍스트 */
const Total = styled.span`
  font-weight: 500;
  font-size: 12px;
  color: #333333;
  margin-left: 6px;
`;

/** 페이지네이션 아이콘 버튼 */
const IconWrapper = styled.button`
  --icon-fill: #c1c5cc;

  &:disabled {
    --icon-fill: #e0e0e0;
    cursor: not-allowed;
  }
`;
