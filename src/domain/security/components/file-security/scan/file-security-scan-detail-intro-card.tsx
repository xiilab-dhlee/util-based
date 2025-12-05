"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { FileSecurityScanSecurityCard } from "@/domain/security/components/file-security/scan/file-security-scan-security-card";
import { FILE_SCAN_TYPE_LABEL } from "@/domain/security/constants/file-security-scan.constant";
import { useGetFileSecurityScanDetail } from "@/domain/security/hooks/use-get-file-security-scan-detail";
import type { FileScanType } from "@/domain/security/schemas/file-security-scan.schema";
import { renderFileScanStatusLabel } from "@/domain/security/utils/file-security-scan-status.util";
import { VULNERABILITY_LEVEL_KEY_TO_CORE_LEVEL } from "@/shared/constants/vulnerability.constant";
import {
  formatDateTimeSafely,
  formatDurationFromSeconds,
} from "@/shared/utils/date.util";

/**
 * 검사 유형 라벨 반환
 */
function getScanTypeLabel(scanType: FileScanType) {
  return FILE_SCAN_TYPE_LABEL[scanType] ?? "-";
}

/**
 * 파일 시스템 보안 검사 상세 페이지의 소개 카드 컴포넌트
 *
 * 검사의 기본 정보(검사 일시, 구분, 상태, 소요시간, 실행자 등)를 표시합니다.
 */
export function FileSecurityScanDetailIntroCard() {
  const { id } = useParams();

  const { data } = useGetFileSecurityScanDetail({
    scanId: Number(id),
  });

  return (
    <Container>
      <Header>
        <HeaderTitle>취약점 검사 상세 정보</HeaderTitle>
      </Header>
      <Body>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="Time" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>검사 일시 :</RowKey>
              <RowValue>
                {data?.creatorDateTime
                  ? formatDateTimeSafely(data.creatorDateTime)
                  : "-"}
              </RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="Calendar01" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>구분 :</RowKey>
              <RowValue>
                {data?.scanType ? getScanTypeLabel(data.scanType) : "-"}
              </RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="SecurityCheck" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>보안 검사 상태 :</RowKey>
              <RowValue>
                {data ? renderFileScanStatusLabel(data.status) : "-"}
              </RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="FinishTime" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>검사 소요 시간 :</RowKey>
              <RowValue>
                {typeof data?.playtime === "number"
                  ? formatDurationFromSeconds(data.playtime)
                  : "-"}
              </RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="Person" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>실행자 :</RowKey>
              <RowValue>{data?.creatorName || "-"}</RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <SecurityRow>
          <SecurityHeader>
            <HeaderTitle>취약점 심각도 현황</HeaderTitle>
          </SecurityHeader>
          <SecurityBody>
            <FileSecurityScanSecurityCard
              level={VULNERABILITY_LEVEL_KEY_TO_CORE_LEVEL.critical}
              count={data?.critical || 0}
            />
            <FileSecurityScanSecurityCard
              level={VULNERABILITY_LEVEL_KEY_TO_CORE_LEVEL.high}
              count={data?.high || 0}
            />
            <FileSecurityScanSecurityCard
              level={VULNERABILITY_LEVEL_KEY_TO_CORE_LEVEL.medium}
              count={data?.medium || 0}
            />
            <FileSecurityScanSecurityCard
              level={VULNERABILITY_LEVEL_KEY_TO_CORE_LEVEL.low}
              count={data?.low || 0}
            />
          </SecurityBody>
        </SecurityRow>
      </Body>
    </Container>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

/**
 * 검사 소개 카드 메인 컨테이너
 */
const Container = styled.div`
  width: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: #171b26;
  padding: 24px;
  overflow: hidden;
`;

/**
 * 카드 헤더 영역
 */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
`;

/**
 * 카드 본문 영역
 */
const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
`;

/**
 * 정보 행 기본 스타일
 */
const Row = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background: #070913;
  border: 1px solid #2a3041;
  border-radius: 4px;
  overflow: hidden;
  height: 40px;
  padding: 0px 10px;
`;

/**
 * 행 본문 영역
 */
const RowBody = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-weight: 700;
  font-size: 12px;
  color: #f5f5f5;
`;

/**
 * 행 제목 영역
 */
const RowTitle = styled.div`
  display: inline-block;
  height: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

/**
 * 행 키 스타일
 */
const RowKey = styled.span`
  margin-right: 4px;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: #f5f5f5;
`;

/**
 * 헤더 타이틀 표시 영역
 */
const HeaderTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  color: #f5f5f5;
  flex: 1;
  overflow: hidden;
`;

/**
 * 행 아이콘 래퍼
 */
const RowIconWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #343c50;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  margin-right: 8px;

  --icon-fill: #e8eaed;
`;

const RowValue = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #cacaca;
`;

const SecurityRow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const SecurityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
`;

const SecurityBody = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
`;
