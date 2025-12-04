"use client";

import { useParams } from "next/navigation";

import { FileSecurityScanDetailAside } from "@/domain/security/components/file-security/scan/file-security-scan-detail-aside";
import { FileSecurityScanFileListBody } from "@/domain/security/components/file-security/scan/file-security-scan-file-list-body";
import { FileSecurityScanFileListFilter } from "@/domain/security/components/file-security/scan/file-security-scan-file-list-filter";
import { FileSecurityScanFileListFooter } from "@/domain/security/components/file-security/scan/file-security-scan-file-list-footer";
import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";

export function FileSecurityScanDetailMain() {
  const { id } = useParams();

  return (
    <>
      <PageHeader
        pageKey="admin.file-security.scan"
        pageParams={{ id: id as string }}
        description="File Security Scan Information"
      />
      <DetailPageBody>
        <FileSecurityScanDetailAside />
        <DetailPageContent>
          <DetailContentSection>
            <FileSecurityScanFileListFilter />
            <FileSecurityScanFileListBody />
            <FileSecurityScanFileListFooter />
          </DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
    </>
  );
}
