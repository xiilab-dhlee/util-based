"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { DeletePrivateRegistryTagModal } from "@/domain/private-registry/components/delete-private-registry-tag-modal";
import { PrivateRegistryTagAside } from "@/domain/private-registry/components/tag/private-registry-tag-aside";
import { PrivateRegistryTagBody } from "@/domain/private-registry/components/tag/private-registry-tag-body";
import { PrivateRegistryTagFilter } from "@/domain/private-registry/components/tag/private-registry-tag-filter";
import { PrivateRegistryTagFooter } from "@/domain/private-registry/components/tag/private-registry-tag-footer";
import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";
import { PRIVATE_REGISTRY_VULNERABILITY_PAGE_SIZE } from "../../constants/private-registry-vulnerability.constant";
import { useGetPrivateRegistryVulnerabilities } from "../../hooks/use-get-private-registry-vulnerabilities";
import { privateRegistryVulnerabilityPageAtom } from "../../state/private-registry-vulnerability.atom";

/**
 * 개인 레지스트리 태그 상세 페이지 메인 컴포넌트
 *
 * - PrivateRegistryTagAside: 이미지 상세 조회, 태그 상세 조회 관리
 * - PrivateRegistryTagMain: 취약점 목록 조회 관리
 */
export function PrivateRegistryTagMain() {
  const { name, tagId } = useParams<{ name: string; tagId: string }>();

  const resetPage = useResetAtom(privateRegistryVulnerabilityPageAtom);

  const page = useAtomValue(privateRegistryVulnerabilityPageAtom);

  // TODO: 취약점 목록 조회 API 연동 필요
  const { data, isLoading, isError } = useGetPrivateRegistryVulnerabilities({
    pageNo: page - 1,
    pageSize: PRIVATE_REGISTRY_VULNERABILITY_PAGE_SIZE,
  });

  useEffect(() => {
    resetPage();
  }, [resetPage]);

  return (
    <>
      <PageHeader
        pageKey="user.private-registry.tag"
        pageParams={{ name: name ?? "", tagId: tagId ?? "" }}
      />
      <DetailPageBody>
        <PrivateRegistryTagAside />
        <DetailPageContent>
          <DetailContentSection>
            <PrivateRegistryTagFilter totalSize={data?.totalSize || 0} />
            <PrivateRegistryTagBody
              data={data?.content || []}
              isLoading={isLoading}
              isError={isError}
            />
            <PrivateRegistryTagFooter
              totalSize={data?.totalSize || 0}
              isLoading={isLoading}
            />
          </DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
      {/* 개인 레지스트리 태그 삭제 모달 */}
      <DeletePrivateRegistryTagModal />
    </>
  );
}
