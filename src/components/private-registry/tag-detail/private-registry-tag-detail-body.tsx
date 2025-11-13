"use client";

import { Skeleton } from "antd";
import { useState } from "react";
import styled from "styled-components";
import { Button, Card, Table, Typography } from "xiilab-ui";

import { openTagLogViewModalAtom } from "@/atoms/private-registry/private-registry-modal.atom";
import {
  SEVERITY_LEVEL_SECONDARY_COLORS,
  SEVERITY_LEVELS,
} from "@/constants/private-registry/severity.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { AsideFillCard } from "@/layouts/aside/aside-fill-card";
import { ListPageFooter } from "@/layouts/list/list-page-footer";
import VulnerabilityDetailModal from "../modal/vulnerability-detail-modal";

interface TagDetailBodyProps {
  isVerifying?: boolean;
}

export function PrivateRegistryTagDetailBody({
  isVerifying = false,
}: TagDetailBodyProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const { onOpen: openLogModal } = useGlobalModal(openTagLogViewModalAtom);

  // 취약점 상세 모달 상태
  const [isVulnerabilityModalOpen, setIsVulnerabilityModalOpen] =
    useState(false);
  const [selectedVulnerability, setSelectedVulnerability] = useState<{
    name: string;
    detail: string;
  } | null>(null);

  const handleVulnerabilityClick = (vulnerability: string) => {
    // 실제로는 API에서 상세 정보를 가져와야 함
    const vulnerabilityDetails = {
      "CVE-2024-28849": `NGINX Open Source and NGINX Plus have
a vulnerability in the ngx_http_mp4_module,
which might allow an attacker to over-read
NGINX worker memory resulting in its termi-
nation, using a specially crafted mp4 file.
The issue only affects NGINX if it is built with
GINX Open Source and NGINX Plus have`,
      "CVE-2024-28863": `This is another critical vulnerability
that affects the system's security. The issue
can lead to unauthorized access and potential
data breaches if not properly addressed.
Users should update to the latest version
to mitigate this security risk.`,
      default: `Vulnerability details are not available
for this specific CVE. Please consult the
official security advisories for more
information about this vulnerability.`,
    };

    setSelectedVulnerability({
      name: vulnerability,
      detail:
        vulnerabilityDetails[
          vulnerability as keyof typeof vulnerabilityDetails
        ] || vulnerabilityDetails.default,
    });
    setIsVulnerabilityModalOpen(true);
  };

  const tableColumns = [
    {
      title: "취약점",
      dataIndex: "vulnerability",
      key: "vulnerability",
      width: 150,
      render: (vulnerability: string) => (
        <ClickableTableText
          onClick={() => handleVulnerabilityClick(vulnerability)}
        >
          {vulnerability}
        </ClickableTableText>
      ),
    },
    {
      title: "심각도",
      dataIndex: "severity",
      key: "severity",
      width: 100,
      align: "center" as const,
      render: (severity: string) => (
        <SeverityRow>
          <SeverityDot $severity={severity.toLowerCase()} />
          <SeverityText $severity={severity.toLowerCase()}>
            {severity}
          </SeverityText>
        </SeverityRow>
      ),
    },
    {
      title: "nvd",
      dataIndex: "nvd",
      key: "nvd",
      width: 80,
      align: "center" as const,
      render: (nvd: string) => <TableText>{nvd}</TableText>,
    },
    {
      title: "redhat",
      dataIndex: "redhat",
      key: "redhat",
      width: 80,
      align: "center" as const,
      render: (redhat: string) => <TableText>{redhat}</TableText>,
    },
    {
      title: "패키지",
      dataIndex: "package",
      key: "package",
      width: 120,
      render: (packageName: string) => <TableText>{packageName}</TableText>,
    },
    {
      title: "현재 버전",
      dataIndex: "currentVersion",
      key: "currentVersion",
      width: 120,
      render: (currentVersion: string) => (
        <TableText>{currentVersion}</TableText>
      ),
    },
    {
      title: "수정된 버전",
      dataIndex: "fixedVersion",
      key: "fixedVersion",
      width: 120,
      align: "center" as const,
      render: (fixedVersion: string) => <TableText>{fixedVersion}</TableText>,
    },
  ];

  const tableData = [
    {
      key: 1,
      vulnerability: "CVE-2024-28849",
      severity: "Critical",
      package: "follow-redirects",
      currentVersion: "1.15.5",
      fixedVersion: "1.15.6",
    },
    {
      key: 2,
      vulnerability: "CVE-2024-28863",
      severity: "Critical",
      package: "tar",
      currentVersion: "6.1.11",
      fixedVersion: "6.2.1",
    },
    {
      key: 3,
      vulnerability: "CVE-2024-27088",
      severity: "High",
      package: "express",
      currentVersion: "4.18.2",
      fixedVersion: "4.19.2",
    },
    {
      key: 4,
      vulnerability: "CVE-2024-26308",
      severity: "High",
      package: "lodash",
      currentVersion: "4.17.20",
      fixedVersion: "4.17.21",
    },
    {
      key: 5,
      vulnerability: "CVE-2024-25710",
      severity: "Medium",
      package: "axios",
      currentVersion: "0.28.0",
      fixedVersion: "1.6.8",
    },
    {
      key: 6,
      vulnerability: "CVE-2024-24758",
      severity: "Medium",
      package: "undici",
      currentVersion: "5.28.3",
      fixedVersion: "6.6.2",
    },
    {
      key: 7,
      vulnerability: "CVE-2024-23692",
      severity: "Low",
      package: "semver",
      currentVersion: "7.5.4",
      fixedVersion: "7.6.0",
    },
  ];

  if (isVerifying) {
    return (
      <VerifyingContainer>
        <VulnerabilityHeader>
          <VulnerabilityTitle>취약점 목록</VulnerabilityTitle>
        </VulnerabilityHeader>
        <VerifyingContent>
          <SkeletonItemsContainer>
            <SkeletonItem>
              <Skeleton.Avatar active size="default" shape="square" />
              <SkeletonTextContainer>
                <SkeletonTextShort active size="small" />
                <SkeletonTextLong active size="small" />
              </SkeletonTextContainer>
            </SkeletonItem>
            <SkeletonItem>
              <Skeleton.Avatar active size="large" shape="square" />
              <SkeletonTextContainer>
                <SkeletonTextMedium active size="small" />
                <SkeletonTextMediumLong active size="small" />
              </SkeletonTextContainer>
            </SkeletonItem>
          </SkeletonItemsContainer>
          <VerifyingTitle>해당 컨테이너 이미지를 검증 중입니다.</VerifyingTitle>
          <VerifyingDescription>
            검증이 끝난 후 선택하신 이미지의 취약점 리스트가 출력됩니다.
            <br />
            검증하는 동안 잠시만 기다려주세요.
          </VerifyingDescription>
        </VerifyingContent>
      </VerifyingContainer>
    );
  }

  return (
    <VulnerabilityContainer>
      <VulnerabilityHeader>
        <VulnerabilityTitle>취약점 목록</VulnerabilityTitle>
        <VulnerabilityCount>총 124개</VulnerabilityCount>
        <ButtonWrapper>
          <Button
            color="primary"
            variant="gradient"
            size="small"
            icon="SourceCode"
            onClick={openLogModal}
            width={100}
          >
            로그 보기
          </Button>
        </ButtonWrapper>
      </VulnerabilityHeader>

      <TableContainer>
        <Table
          columns={tableColumns}
          dataSource={tableData}
          pagination={false}
          size="middle"
          scroll={{ y: 400 }}
        />
      </TableContainer>

      <ListPageFooter
        page={currentPage}
        total={124}
        pageSize={pageSize}
        onChange={(page) => setCurrentPage(page)}
      />

      {/* 취약점 상세 모달 */}
      <VulnerabilityDetailModal
        open={isVulnerabilityModalOpen}
        onClose={() => setIsVulnerabilityModalOpen(false)}
        vulnerabilityDetail={selectedVulnerability?.detail}
      />
    </VulnerabilityContainer>
  );
}

// Critical 취약점 목록을 별도 컴포넌트로 export
export function CriticalVulnerabilityList() {
  const criticalVulnerabilities = [
    {
      id: 1,
      cveId: "CVE-2024-28849",
      packageName: "follow-redirects",
      currentVersion: "1.15.5",
      nvd: "9.8",
      redhat: "9.8",
      description:
        "follow-redirects의 부적절한 입력 검증으로 인한 임의 코드 실행 취약점",
    },
    {
      id: 2,
      cveId: "CVE-2024-28863",
      packageName: "tar",
      currentVersion: "6.1.11",
      nvd: "8.5",
      redhat: "8.2",
      description: "tar 패키지의 경로 순회 취약점으로 임의 파일 덮어쓰기 가능",
    },
    {
      id: 3,
      cveId: "CVE-2024-27088",
      packageName: "express",
      currentVersion: "4.18.2",
      nvd: "9.1",
      redhat: "8.8",
      description: "Express.js의 HTTP 헤더 주입 취약점",
    },
    {
      id: 4,
      cveId: "CVE-2024-26308",
      packageName: "lodash",
      currentVersion: "4.17.20",
      nvd: "7.9",
      redhat: "7.5",
      description: "lodash 라이브러리의 프로토타입 오염 취약점",
    },
    {
      id: 5,
      cveId: "CVE-2024-25710",
      packageName: "axios",
      currentVersion: "0.28.0",
      nvd: "8.7",
      redhat: "8.3",
      description: "axios HTTP 클라이언트의 SSRF 취약점",
    },
    {
      id: 6,
      cveId: "CVE-2024-24758",
      packageName: "undici",
      currentVersion: "5.28.3",
      nvd: "9.2",
      redhat: "8.9",
      description: "undici HTTP 클라이언트의 정보 노출 취약점",
    },
  ];

  return (
    <AsideFillCard
      title="취약점 Critical 목록"
      titleExtra={`총 ${criticalVulnerabilities.length}개`}
    >
      <CriticalGrid>
        {criticalVulnerabilities.map((vuln) => (
          <Card
            key={vuln.id}
            title={vuln.cveId}
            width="172px"
            height="132px"
            showHeader={true}
          >
            <VulnContentWrapper>
              <VulnInfoRow>
                <VulnLabel>패키지:</VulnLabel>
                <VulnValue>{vuln.packageName}</VulnValue>
              </VulnInfoRow>
              <VulnInfoRow>
                <VulnLabel>현재버전:</VulnLabel>
                <VulnValue>{vuln.currentVersion}</VulnValue>
              </VulnInfoRow>
              <VulnInfoRow>
                <VulnLabel>nvd:</VulnLabel>
                <VulnValue>{vuln.nvd}</VulnValue>
              </VulnInfoRow>
              <VulnInfoRow>
                <VulnLabel>redhat:</VulnLabel>
                <VulnValue>{vuln.redhat}</VulnValue>
              </VulnInfoRow>
            </VulnContentWrapper>
          </Card>
        ))}
      </CriticalGrid>
    </AsideFillCard>
  );
}


const VulnerabilityContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
`;

const VulnerabilityHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const VulnerabilityTitle = styled(Typography.Text).attrs({
  variant: "title-2",
  as: "h2",
})`
  color: #000000;
  margin: 0;
`;

const VulnerabilityCount = styled(Typography.Text).attrs({
  variant: "body-2-4",
})`
  color: #000000;
`;

const CriticalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const VulnContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  gap: 4px;
  padding: 10px;
`;

const VulnInfoRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: flex-start;
`;

const VulnLabel = styled(Typography.Text).attrs({
  variant: "body-2-4",
})`
  color: #666666;
  min-width: fit-content;
`;

const VulnValue = styled(Typography.Text).attrs({
  variant: "body-2-4",
})`
  color: #000000;
  word-break: break-all;
`;

const SeverityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SeverityDot = styled.div<{ $severity: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ $severity }) => {
    switch ($severity) {
      case SEVERITY_LEVELS.CRITICAL:
        return SEVERITY_LEVEL_SECONDARY_COLORS[SEVERITY_LEVELS.CRITICAL];
      case SEVERITY_LEVELS.HIGH:
        return SEVERITY_LEVEL_SECONDARY_COLORS[SEVERITY_LEVELS.HIGH];
      case SEVERITY_LEVELS.MEDIUM:
        return SEVERITY_LEVEL_SECONDARY_COLORS[SEVERITY_LEVELS.MEDIUM];
      case SEVERITY_LEVELS.LOW:
        return SEVERITY_LEVEL_SECONDARY_COLORS[SEVERITY_LEVELS.LOW];
      default:
        return SEVERITY_LEVEL_SECONDARY_COLORS[SEVERITY_LEVELS.LOW];
    }
  }};
`;

const SeverityText = styled(Typography.Text).attrs({
  variant: "body-2-4",
})<{ $severity: string }>`
  color: ${({ $severity }) => {
    switch ($severity) {
      case SEVERITY_LEVELS.CRITICAL:
        return SEVERITY_LEVEL_SECONDARY_COLORS[SEVERITY_LEVELS.CRITICAL];
      case SEVERITY_LEVELS.HIGH:
        return SEVERITY_LEVEL_SECONDARY_COLORS[SEVERITY_LEVELS.HIGH];
      case SEVERITY_LEVELS.MEDIUM:
        return SEVERITY_LEVEL_SECONDARY_COLORS[SEVERITY_LEVELS.MEDIUM];
      case SEVERITY_LEVELS.LOW:
        return SEVERITY_LEVEL_SECONDARY_COLORS[SEVERITY_LEVELS.LOW];
      default:
        return SEVERITY_LEVEL_SECONDARY_COLORS[SEVERITY_LEVELS.LOW];
    }
  }};
`;

const TableText = styled(Typography.Text).attrs({
  variant: "body-2-4",
})`
  color: #000000;
`;

const ClickableTableText = styled(Typography.Text).attrs({
  variant: "body-2-4",
})`
  color: #000000;
  cursor: pointer;

  &:hover {
    cursor: pointer;
  }
`;

const ButtonWrapper = styled.div`
  margin-left: auto;
`;

const VerifyingTitle = styled(Typography.Text).attrs({
  variant: "subtitle-2-1",
})`
  color: #333333;
  text-align: center;
  margin-bottom: 8px;
`;

const VerifyingDescription = styled(Typography.Text).attrs({
  variant: "body-2-4",
})`
  color: #666666;
  text-align: center;
`;

const VerifyingContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const VerifyingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px;
`;

const SkeletonItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
`;

const SkeletonItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const SkeletonTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SkeletonTextShort = styled(Skeleton.Button)`
  width: 120px !important;
  height: 12px !important;
  margin-bottom: 8px !important;
`;

const SkeletonTextLong = styled(Skeleton.Button)`
  width: 180px !important;
  height: 12px !important;
`;

const SkeletonTextMedium = styled(Skeleton.Button)`
  width: 140px !important;
  height: 12px !important;
  margin-bottom: 8px !important;
`;

const SkeletonTextMediumLong = styled(Skeleton.Button)`
  width: 160px !important;
  height: 12px !important;
`;
